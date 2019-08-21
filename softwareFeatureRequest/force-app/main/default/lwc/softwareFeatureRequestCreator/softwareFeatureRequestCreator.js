import { LightningElement } from "lwc";
import request from "@salesforce/schema/Software_Feature_Request__c";
import title from "@salesforce/schema/Software_Feature_Request__c.Title__c";
import description from "@salesforce/schema/Software_Feature_Request__c.Description__c";
import status from "@salesforce/schema/Software_Feature_Request__c.Status__c";
import software from "@salesforce/schema/Software_Feature_Request__c.Software_Product__c";

export default class SoftwareFeatureRequestCreator extends LightningElement {
  object = request;
  fields = [title, description, status, software];

  handleCreate() {}
}
