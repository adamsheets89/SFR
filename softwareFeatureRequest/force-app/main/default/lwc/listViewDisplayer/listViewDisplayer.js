import { LightningElement, track, wire } from "lwc";
import getData from "@salesforce/apex/listViewDisplayerController.getData";
import { subscribe } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ListViewDisplayer extends LightningElement {
	channelName = '/topic/SFRChanges';
	columns = [
		{ label: "Title", fieldName: "Title__c" },
		{ label: "Description", fieldName: "Description__c" },
		{ label: "Status", fieldName: "Status__c" },
		{ label: "Software Product", fieldName: "Software_Product__c" },
		{ label: "Related Files", fieldName: "Related_Files__c" }
	];

	requests;
	@track myRequests;
	@track queueRequests;
	@track error;
	newRequest;
	owners;

	recordId;

	connectedCallback() {
		subscribe(this.channelName, -1, (response) => {
			this.newRequest = response.data.sobject;
			this.handleSubscriptionResponse(response.data);
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
			this.showToast(
				'Error',
				this.error,
				'error'
			);
		}
	}

	filterRequests() {
		let myRequests = [];
		let queueRequests = [];
		this.requests.forEach(request => {
			if (request.OwnerId === this.owners.queue) {
				queueRequests.push(request);
			} else if (request.OwnerId === this.owners.user) {
				myRequests.push(request);
			}
		});
		this.myRequests = myRequests;
		this.queueRequests = queueRequests;
	}

	handleSubscriptionResponse(data) {
		const type = data.event.type;
		const recordId = data.sobject.Id;
		const ownerId = data.sobject.OwnerId;
		let updatedRequests = [...this.requests];

		if (type === 'deleted') {
			updatedRequests = updatedRequests.filter(request => request.Id !== recordId);
		} else if (type === 'created') {
			updatedRequests.push(this.newRequest);
		} else if (type === 'updated') {
			for (let i = 0; i < updatedRequests.length; i++) {
				if (updatedRequests[i].Id === recordId) {
					if (ownerId !== updatedRequests[i].OwnerId && ownerId !== this.owners.queue && ownerId !== this.owners.user) {
						this.showToast(
							'Record Update',
							'Software Feature Request "' + data.sobject.Title__c + '" has been assigned to another user.',
							'success'
						);
					}
					updatedRequests.splice(i, 1);
				}
			}
			updatedRequests.push(this.newRequest);
		}
		this.requests = updatedRequests;
		this.filterRequests();
	}

	showToast(title, message, status) {
		const evt = new ShowToastEvent({
			title: title,
			message: message,
			variant: status,
		});
		this.dispatchEvent(evt);
	}
}