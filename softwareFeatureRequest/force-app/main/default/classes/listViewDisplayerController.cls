public with sharing class listViewDisplayerController {
    public listViewDisplayerController() {

    }

    // @AuraEnabled(cacheable=true)
    // public static List<Software_Feature_Request__c> getSoftwareFeatureRequests(){
    //     return [SELECT Id, Title__c, Description__c, Name, OwnerId, Owner.Name FROM Software_Feature_Request__c LIMIT 1000];
    // }

    // @AuraEnabled(cacheable=true)
    // public static Map<String, Id> getOwnerIds(){
    //     return (new Map<String, Id>{
    //         'user' => UserInfo.getUserId(),
    //         'queue' => [SELECT Id FROM Group WHERE Type='Queue' AND Name='Software Feature Request Queue'].Id
    //     });
    // }

    @AuraEnabled(cacheable=true)
    public static Map<String,Object> getData(){
        List<Software_Feature_Request__c> requests = [SELECT Id, Title__c, Description__c, Name, OwnerId, Owner.Name FROM Software_Feature_Request__c LIMIT 1000];

        Map<String, Id> owners = new Map<String, Id>{
            'user' => UserInfo.getUserId(),
            'queue' => [SELECT Id FROM Group WHERE Type='Queue' AND Name='Software Feature Request Queue'].Id
        };

        return (new Map<String, Object>{
            'requests' => requests,
            'owners' => owners
        });
    }
}
