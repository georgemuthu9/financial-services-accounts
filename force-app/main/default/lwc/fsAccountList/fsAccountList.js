import { LightningElement, wire } from "lwc";
import getFSAccounts from "@salesforce/apex/FinancialServicesAccountsCountroller.getFSAccounts";
import { NavigationMixin } from 'lightning/navigation';


export default class FsAccountList extends NavigationMixin(LightningElement) {
  pageToken;
  searchTerm;
  accounts;
  error;
  sortedBy = 'name';
  sortedDirection = 'asc';

  connectedCallback() {
    this.fetchAccounts();
  }

  fetchAccounts() {
    getFSAccounts({ accountName: this.searchTerm, sortBy: this.sortedBy, sortDirection: this.sortedDirection })
      .then(result => {
        this.accounts = result.map(account => {
          return {
            nameLabel: account.Name,
            name: "/" + account.Id,
            "owner.Name": account.Owner.Name,
            phone: account.Phone,
            website: account.Website,
            annualRevenue: account.AnnualRevenue,
            id: account.Id
          };
        });
      })
      .catch(error => {
        this.error = error;
      });
  }

  get columns() {
    return [
      {
        label: "Name",
        fieldName: "name",
        sortable: true,
        type: "url",
        hideDefaultActions: true,
        typeAttributes: { label: { fieldName: "nameLabel" }, target: "_blank" }
      },
      { label: "Owner", fieldName: "owner.Name", hideDefaultActions: true, sortable: true },
      {
        label: "Phone",
        fieldName: "phone",
        type: "phone",
        hideDefaultActions: true
      },
      {
        label: "Website",
        fieldName: "website",
        type: "url",
        hideDefaultActions: true
      },
      {
        label: "Annual Revenue",
        fieldName: "annualRevenue",
        type: "currency",
        hideDefaultActions: true
      },
      {
        type: 'action', typeAttributes: { rowActions: [{ label: 'edit', name: 'edit' }], menuAlignment: 'left' } 
      }
    ];
  }

  handleKeyUp(evt) {
    const isEnterKey = evt.keyCode === 13;
    if (isEnterKey) {
      this.searchTerm = evt.target.value;
      this.fetchAccounts();
    }
  }

  handleSorting(evt) {
    var fieldName = evt.detail.fieldName;
    var sortDirection = evt.detail.sortDirection;
    this.sortedBy = fieldName;
    this.sortedDirection = sortDirection;
    this.fetchAccounts();
  }
  handleRowAction(event) {
    const row = event.detail.row;

    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: row.id,
            actionName: 'edit'
        }
    });


  }
}
