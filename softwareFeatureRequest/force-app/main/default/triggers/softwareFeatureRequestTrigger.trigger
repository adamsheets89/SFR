trigger softwareFeatureRequestTrigger on Software_Feature_Request__c (before insert, after insert, before update, after update) {
    if (Trigger.isBefore && Trigger.isInsert){
        softwareFeatureRequestTriggerHandler.beforeInsert(Trigger.new);
    }
}