import { LightningElement, wire } from "lwc";
import getSoftwareFeatureRequests from "@salesforce/apex/listViewDisplayerController.getSoftwareFeatureRequests";

export default class ListViewDisplayer extends LightningElement {
  @wire(getSoftwareFeatureRequests)
  resources;
}
