export interface Company{
    type?: string;
    Name: string;
    Id: string;
    CompanyAddress?:string;
    CompanyId:string;
    CompanyIdent:string;
    CompanyName:string;
    CompanyTelNo?:string;
    CompanyVatNo?:string;
    ContactEmail?:string;
    ContactName?:string;
    ContactTelNo?:string;
    DomainList?:string[]
    InitialTier?:string;
    IsDealerFlag:string;
    ParentCompanyId:string;
    SPMCompanyType:string;
    children?:Company[]
}