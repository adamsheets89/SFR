@isTest
public with sharing class softwareFeatureRequestTrigger_Test {
    @isTest static void insertSFRTest(){
        Software_Feature_Request__c request = new Software_Feature_Request__c(
            Title__c = 'Test request',
            Description__c ='Test description',
            Status__c = 'Open',
            Software_Product__c = 'Test prod'
        );

        Test.StartTest();
        insert request;
        Test.StopTest();
        Software_Feature_Request__c updatedReq = [SELECT Id, OwnerId FROM Software_Feature_Request__c WHERE Id=:request.Id];
        System.assertEquals([Select Id FROM Group WHERE Type='Queue' AND Name='Software Feature Request Queue'].Id, updatedReq.OwnerId);
    }
}