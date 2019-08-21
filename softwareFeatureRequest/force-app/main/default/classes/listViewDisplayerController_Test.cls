@isTest
public with sharing class listViewDisplayerController_Test {
    @isTest static void getDataTest(){
        Software_Feature_Request__c request = new Software_Feature_Request__c(
            Title__c = 'Test request',
            Description__c ='Test description',
            Status__c = 'Open',
            Software_Product__c = 'Test prod'
        );
        insert request;

        Software_Feature_Request__c request2 = new Software_Feature_Request__c(
            Title__c = 'Test request2',
            Description__c ='Test description2',
            Status__c = 'Open',
            Software_Product__c = 'Test prod2'
        );
        insert request2;
        request2.OwnerId = UserInfo.getUserId();
        update request2;

        Test.StartTest();
        Map<String, Object> response = ListViewDisplayerController.getData();
        Test.StopTest();

        List<Software_Feature_Request__c> requests = (List<Software_Feature_Request__c>)response.get('requests');
        Map<String, Id> owners = (Map<String, Id>)response.get('owners');

        System.assertEquals(2, requests.size());
        System.assertEquals(UserInfo.getUserId(), owners.get('user'));
    }
}