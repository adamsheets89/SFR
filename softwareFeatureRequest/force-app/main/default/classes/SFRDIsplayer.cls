public with sharing class SFRDIsplayer {
    public SFRDIsplayer() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Software_Feature_Request__c> getSoftwareFeatureRequests(){
        return [SELECT Id, Title__c, Description__c, Name, OwnerId FROM Software_Feature_Request__c LIMIT 1000];
    }
}
