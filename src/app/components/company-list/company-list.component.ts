import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { files } from './example-data';
import { Globals } from 'src/app/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/company.model';

export interface tCompany{
  Name:string
  Id:string
  Ident:string

}

/** File node data with possible child nodes. */
export interface FileNode {
  Name: string;
  Id: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  Name: string;
  //type: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  private companyList: Company[]
  
  constructor(private globals: Globals, private http: HttpClient) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    //this.ngOnInit();
   // 
    
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      Name: node.Name,
      Id: node.Id,
      level: level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }

  ngOnInit(): void {
    let param = new HttpParams();
        param = param.append('AuthToken',this.globals.getAuthToken());
        param = param.append('UserName', this.globals.getSystemUserName());
        param = param.append('DataIncludeInd','F');
        this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyHierarchy.php',{params:param}).subscribe({next: data => 
      {this.companyList = <Company[]>data.CompanyList;

      

      var i,ii
      for(i = (this.companyList.length-1); i >=0 ; i--){
        if(this.companyList[i].ParentCompanyId!=this.globals.getCompanyId()){
          for(ii = (this.companyList.length-1); ii >=0; ii--){
            if (this.companyList[ii].Id==this.companyList[i].ParentCompanyId){
              
              if(this.companyList[ii].children!=null){
                this.companyList[ii].children.push(this.companyList[i]);
                this.companyList[ii].children.sort(function (x, y) {
                  let a = x.Name.toUpperCase(),
                      b = y.Name.toUpperCase();
                  return a == b ? 0 : a > b ? 1 : -1;
              });
                this.companyList.splice(i,1)
                break;
              }
              if(this.companyList[ii].children==null){
                this.companyList[ii].children=[this.companyList[i]];
                this.companyList.splice(i,1)
                break;
              }
            }
          }
        }
      }

      this.companyList.sort(function (x, y) {
        let a = x.Name.toUpperCase(),
            b = y.Name.toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
    });
    
      this.dataSource.data = this.companyList;
    },
      error: error => 
      {console.error('There was an error!');}
    })
}}

