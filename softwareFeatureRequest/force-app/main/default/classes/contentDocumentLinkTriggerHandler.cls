public with sharing class contentDocumentLinkTriggerHandler {
    public static void afterInsert(List<ContentDocumentLink> links){
        List<Id> contentDocIds = new List<Id>();
        for (ContentDocumentLink link : links){
            contentDocIds.add(link.ContentDocumentId);
        } 

        Map<Id, ContentDocument> files = new Map<Id, ContentDocument>([SELECT Id, Title FROM ContentDocument WHERE Id IN: contentDocIds]);

        Map<Id, String> sfrIdToLinkTitle = new Map<Id, String>();

        for (ContentDocumentLink link : links){
            if (link.LinkedEntityId.getSobjectType().getDescribe().getName() == 'Software_Feature_Request__c'){
                sfrIdToLinkTitle.put(link.LinkedEntityId, files.get(link.ContentDocumentId).Title);
            }
        }

        List<Software_Feature_Request__c> requestsToUpdate = [SELECT Id, Related_Files__c
                                                              FROM Software_Feature_Request__c
                                                              WHERE Id IN: sfrIdToLinkTitle.keySet()];
        
        for (Software_Feature_Request__c request : requestsToUpdate){
            String filesString = request.Related_Files__c;
            if (String.isBlank(filesString)){
                request.Related_Files__c = sfrIdToLinkTitle.get(request.Id);
            } else {
                request.Related_Files__c = filesString + '; ' + sfrIdToLinkTitle.get(request.Id);
            }
        }
        update requestsToUpdate;
    }
}
