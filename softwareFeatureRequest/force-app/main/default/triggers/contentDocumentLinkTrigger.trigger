trigger contentDocumentLinkTrigger on ContentDocumentLink (after insert) {
    if (Trigger.isInsert && Trigger.isAfter){
        contentDocumentLinkTriggerHandler.afterInsert(Trigger.new);
    }
}