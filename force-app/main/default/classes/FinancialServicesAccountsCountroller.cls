public without sharing class FinancialServicesAccountsCountroller {
    @AuraEnabled(cacheable=false)
    public static List<Account> getFSAccounts(String accountName, String sortBy, String sortDirection){
        String query = 'select id, name, owner.name, annualRevenue, phone, website from account where Industry = \'Financial Services\' {0} order by {1} {2}';
        query = String.format(
            query, 
            new List<String> {
                accountName != null? 'AND Name like \'%' + accountName + '%\'' :'',
                sortBy != null? sortBy: 'Name',
                sortDirection != null? sortDirection: 'ASC'
            }
        );
        return Database.query(query);
    }
}
