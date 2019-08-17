import { LightningElement, wire } from "lwc";
import getSoftwareFeatureRequests from "@salesforce/apex/SFRDisplayer.getSoftwareFeatureRequests";

export default class SFRDisplayer extends LightningElement {
  @wire(getSoftwareFeatureRequests)
  resources;
}
