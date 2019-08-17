public with sharing class softwareFeatureRequestTriggerHandler {
    public static void beforeInsert(List<Software_Feature_Request__c> requests){
        Id queueId = [SELECT Id FROM Group WHERE Type='Queue' AND Name='Software Feature Request Queue'].Id;
        for (Software_Feature_Request__c request : requests){
            request.OwnerId = queueId;
        }
    }
}