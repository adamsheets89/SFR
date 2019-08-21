import { LightningElement, track, wire } from "lwc";
import getData from "@salesforce/apex/listViewDisplayerController.getData";
import { subscribe, onError } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ListViewDisplayer extends LightningElement {
	channelName = '/topic/SFRChanges';
	columns = [
		{ label: "Title", fieldName: "Title__c" },
		{ label: "Description", fieldName: "Description__c" },
		{ label: "Owner", fieldName: "OwnerId", editable: true }
	];

	@track requests;
	@track myRequests;
	@track queueRequests;
	@track error;
	newRequest;
	owners;

	recordId;

	connectedCallback() {
		subscribe(this.channelName, -1, (response) => {
			console.log(JSON.stringify(response));
			this.newRequest = response.data.sobject;
			this.handleSubscriptionEvent(response.data);
		})
	}

	@wire(getData)
	wiredCall({ error, data }) {
		if (data) {
			this.requests = data.requests;
			this.owners = data.owners;
			this.filterRequests();
		} else if (error) {
			this.error = error;
		}
	}

	filterRequests() {
		let myRequests = [];
		let queueRequests = [];
		this.requests.forEach(request => {
			console.log('request : ', JSON.parse(JSON.stringify(request)));
			if (request.OwnerId === this.owners.queue) {
				queueRequests.push(request);
			} else {
				myRequests.push(request);
			}
		});
		this.myRequests = myRequests;
		this.queueRequests = queueRequests;
	}

	handleSubscriptionEvent(data) {
		const type = data.event.type;
		const recordId = data.sobject.Id;
		const ownerId = data.sobject.OwnerId;
		const title = data.sobject.Title__c;
		let updatedRequests = [...this.requests];

		if (type === 'deleted') {
			updatedRequests = updatedRequests.filter(request => request.Id !== recordId);
		} else if (type === 'created') {
			updatedRequests.push(this.newRequest);
		} else if (type === 'updated') {
			updatedRequests.forEach((request) => {
				if (request.Id === recordId && request.OwnerId !== ownerId) {
					this.showToast('Software Feature Request "' + title + '" has been reassigned to another user.');
				}
			})
			updatedRequests = updatedRequests.filter(request => request.Id !== recordId);
			updatedRequests.push(this.newRequest);
		}
		this.requests = updatedRequests;
		this.filterRequests();
	}

	showToast(message) {
		const evt = new ShowToastEvent({
			title: 'Record Updated',
			message: message,
			variant: 'success',
		});
		this.dispatchEvent(evt);
	}
}