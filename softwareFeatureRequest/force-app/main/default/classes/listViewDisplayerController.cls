public with sharing class listViewDisplayerController {
    @AuraEnabled(cacheable=true)
    public static Map<String,Object> getData(){
        Map<String, Id> owners = new Map<String, Id>{
            'user' => UserInfo.getUserId(),
            'queue' => [SELECT Id FROM Group WHERE Type='Queue' AND Name='Software Feature Request Queue'].Id
        };

        List<Software_Feature_Request__c> requests = [SELECT Id, Title__c, Description__c, Name, OwnerId, Owner.Name 
                                                      FROM Software_Feature_Request__c 
                                                      WHERE OwnerId IN: owners.values()];

        return (new Map<String, Object>{
            'requests' => requests,
            'owners' => owners
        });
    }
}