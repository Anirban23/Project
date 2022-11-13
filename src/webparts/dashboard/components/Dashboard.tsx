
import * as React from 'react';
import styles from './Dashboard.module.scss';
import { IDashboardProps } from './IDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import { SPFI, spfi } from "@pnp/sp/presets/all"; 

import { SPFI, spfi } from "@pnp/sp";
import "@pnp/sp/site-users/web";
import { getSP } from "../pnpjsConfig";

import { Caching } from "@pnp/queryable";
import "@pnp/sp/fields";
import "@pnp/sp/site-users/web";
import { Fields, IField, IFieldInfo } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields";

import 'bootstrap/dist/css/bootstrap.min.css';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import dateFormat from 'dateformat';
import { GridApi, SelectionChangedEvent } from 'ag-grid-community';

import { IButtonProps, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import { PivotItem, IPivotItemProps, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { DatePicker, FontWeights, IIconProps, Label, Spinner, TextField, TooltipHost } from 'office-ui-fabric-react';
import { SPComponentLoader } from '@microsoft/sp-loader';

import 'office-ui-fabric-react/dist/css/fabric.css';





var viewConsultantName = true,
  viewID = true,
  viewAssignmentID = true,
  viewConsultantID = true,
  viewProjectID = true,
  viewTypeofService = true,
  viewServiceDescription = true,
  viewInvoiceDate = true,
  viewMonthofService = true,
  viewInvoiceAmount = true,
  viewRemarks = true,
  viewPaymentTerms = true,
  viewApprover = true,
  viewApproverStatus = true,
  viewApproverRemarks = true,
  viewPaymentStatus = true,
  viewServicesRepRemarks = true,
  viewCreated = true,
  viewCreatedBy = true,
  viewModified = true,
  viewModifiedBy = true

const gridOptions = {
  pagination: true,
  paginationPageSize: 40,
}


const widthAction = '55px', widthIDVal = '60px', widthConsultantName = '105px', widthAssignmentId = '105px', widthConsultantID = '100px', widthProjectId = '85px', widthTypeofService = '95px', widthServiceDescription = '130px', widthInvoiceDate = '85px', widthMonthofService = '95px', widthInvoiceAmount = '85px', widthPaymentDate = '86px', widthPayByDate = '81px', widthRemarks = '90px', widthPaymentTerms = '95px', widthApprover = '95px', widthApproverStatus = '95px', widthApproverRemarks = '95px', widthPaymentStatus = '95px', widthServicesRep = '105px', widthServicesRepRemarks = '110px', widthCreated = '87px', widthCreatedBy = '87px', widthModified = '95px', widthModifiedBy = '95px';

const addIcon: IIconProps = { iconName: 'Add' };
const AcceptMediumIcon: IIconProps = { iconName: 'AcceptMedium' };
const StatusErrorFullIcon: IIconProps = { iconName: 'StatusErrorFull' };
//const ArrangeBringToFrontIcon: IIconProps = { iconName: 'ArrangeBringToFrontIcon' };

export default class Dashboard extends React.Component<IDashboardProps, any> {
  [x: string]: any;
  private _sp: SPFI;



  public constructor(props: IDashboardProps) {
    super(props);
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css");

    this.state = {
      listData: [],
      listData15: [],
      listData30: [],
      listData60: [],
      listDataAll: [],
      allData: [],
      listData1: [],
      listData15EditInv: [],
      listData15Rejected: [],
      listData15ApproverRejected: [],
      listDataAllMe: [],
      listDataAllRejected: [],
      listData15ApproverNew: [],
      listData15ApproverAll: [],
      listData15ApproverApproved: [],
      listData15ApproverRejectedMe: [],
      listData15ApproverHold: [],
      listDataApproverNew: [],
      listDataApproverApproved: [],
      listDataApproverRejected: [],
      listDataApproverHold: [],
      listDataApproverAll: [],
      listDataHRApprovalNew: [],
      listDataHRApprovalHold: [],
      listDataHRReadytobePaid: [],
      listDataHRApprovalApproved: [],
      listDataHRPaid: [],
      listDataHRApprovalRejected: [],
      listDataSRDNew: [],
      listDataSRDHold: [],
      listDataSRDApproved: [],
      listDataSRDPaid: [],
      listDataSRDRejected: [],
      listDataSRDReadyToBePaid: [],
      listDataSRDAll: [],

      loadStartDate: new Date(),
      loadEndDate: new Date(),

      viewAttachmentLink: [],

      viewHRTab: false,
      viewFinanceTab: false,
      viewApproverTab: false,
      viewUserTab: false,
      UploadInvoiceUrl: '',

      AproverChoice: '',
      appRemarks: '',
      textCheck: '',
      StatusLebel: '',
      FinalPaymentDate: '',
      SupportiveDocs: [],

      // columnDef: [

      //   {
      //     headerName: "Edit",
      //     field: "ID",
      //     cellRendererFramework: (e: any) => <div>
      //       <button onClick={() => this.getFn(e)} className={styles['button-4']}>Click Here</button>
      //     </div>
      //   },
      //   { headerName: "ID", field: "IDVal", hide: { viewID } },
      //   { headerName: "Consultant Name", field: "ConsultantName", hide: { viewConsultantName } },
      //   { headerName: "AssignmentId", field: "AssignmentId", hide: { viewAssignmentID } },
      //   { headerName: "Consultant Id", field: "ConsultantID", hide: { viewConsultantID } },
      //   { headerName: "Project Id", field: "ProjectId", hide: { viewProjectID } },
      //   { headerName: "Type of Service", field: "TypeofService", hide: { viewTypeofService } },
      //   { headerName: "Service Description", field: "ServiceDescription", hide: { viewServiceDescription } },
      //   { headerName: "Invoice Date", field: "InvoiceDate", hide: { viewInvoiceDate } },
      //   { headerName: "Month of Service", field: "MonthofService", hide: { viewMonthofService } },
      //   { headerName: "Invoice Amount", field: "InvoiceAmount", hide: { viewInvoiceAmount } },
      //   { headerName: "Remarks", field: "Remarks", hide: { viewRemarks } },
      //   { headerName: "Payment Terms", field: "PaymentTerms", hide: { viewPaymentTerms } },
      //   { headerName: "Approver", field: "Approver", hide: { viewApprover } },
      //   { headerName: "Approver Status", field: "ApproverStatus", hide: { viewApproverStatus } },
      //   { headerName: "Approver Remarks", field: "ApproverRemarks", hide: { viewApproverRemarks } },
      //   { headerName: "Payment Status", field: "PaymentStatus", hide: { viewPaymentStatus } },
      //   { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: { viewServicesRepRemarks } },
      //   { headerName: "Created", field: "Created", hide: { viewCreated } },
      //   { headerName: "Created by", field: "CreatedBy", hide: { viewCreatedBy } },
      //   { headerName: "Modified", field: "Modified", hide: { viewModified } },
      //   { headerName: "Modified by", field: "ModifiedBy", hide: { viewModifiedBy } }
      // ],
      columnDefRecentEditInvoice: [
        {
          headerName: "",
          width: widthAction,
          field: "IDVal",
          cellRendererFramework: (item: any) => {
            let oneDay = new Date();
            oneDay.setDate(oneDay.getDate() - 1);
            if ((new Date(item.data.CreatedForCheck) > oneDay && new Date(item.data.CreatedForCheck) <= new Date()) && (item.data.ApproverStatus == "New")) {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i>
                </div>
              )
            }
            else {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)} style={{ display: 'none' }}></i>
                </div>
              )
            };

          }

        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal, },
        // { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        {
          headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId,

        },
        // { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        {
          headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService'
        },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription', },


        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },

        // { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefRecentClaimRejected: [
        {
          headerName: "",
          field: "IDVal",
          width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        // { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        // { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Finance Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },

        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        // { headerName: "Remarks", field: "Remarks", hide: true, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApprover },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },

        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefRecentClaimRejectedbyApprover: [
        {
          headerName: "",
          field: "IDVal",
          width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        // { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        // { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },

        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        // { headerName: "Remarks", field: "Remarks", hide: true, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },

        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDef30Days: [
        {
          headerName: "",
          field: "IDVal",
          width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Remarks", field: "Remarks", hide: true, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApprover },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDef60Days: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Remarks", field: "Remarks", hide: true, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefAllDays: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Remarks", field: "Remarks", hide: true, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefRejected: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        // { headerName: "Consultant Name", field: "ConsultantName", hide: true, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        // { headerName: "Consultant Id", field: "ConsultantID", hide: true, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Remarks", field: "Remarks", hide: true, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },

        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefApproverRecentNew: [

        { headerName: "ID", field: "IDVal", hide: true, width: widthAction },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName, checkboxSelection: true, },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: true, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        // { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy },
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => {
            let oneDay = new Date();
            oneDay.setDate(oneDay.getDate() - 1);
            if ((new Date(item.data.CreatedForCheck) > oneDay && new Date(item.data.CreatedForCheck) <= new Date())) {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  {/* <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
                </div>
              )
            }
            else {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  {/* <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)} style={{ display: 'none' }}></i> */}
                </div>
              )
            }
          }
        },
      ],
      columnDefApproverRecentApproved: [
        // { headerName: "ID", field: "IDVal", hide: true, width: widthAction },
        // { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName, },
        // { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        // { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        // { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        // { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        // { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        // { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        // { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: true, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        // { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy },
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => {
            let oneDay = new Date();
            oneDay.setDate(oneDay.getDate() - 1);
            if ((new Date(item.data.ModifiedForCheck) > oneDay && new Date(item.data.ModifiedForCheck) <= new Date())) {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i>
                </div>
              )
            }
            else {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)} style={{ display: 'none' }}></i>
                </div>
              )
            }
          }
        },

      ],
      columnDefApproverRecentRejected: [
        { headerName: "ID", field: "IDVal", hide: true, width: widthAction },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName, checkboxSelection: true, },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: true, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        // { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy },
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => {

            let oneDay = new Date();
            oneDay.setDate(oneDay.getDate() - 1);
            if ((new Date(item.data.ModifiedForCheck) > oneDay && new Date(item.data.ModifiedForCheck) <= new Date())) {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i>
                </div>
              )
            }
            else {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)} style={{ display: 'none' }}></i>
                </div>
              )
            }
          }
        },

      ],
      columnDefApproverRecentHold: [

        { headerName: "ID", field: "IDVal", hide: true, width: widthAction },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName, checkboxSelection: true, },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: true, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        // { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        // { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy },
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => {
            return (
              <div className={styles.linkFont}>
                <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i>
              </div>
            )
          }
        },
      ],
      columnDefApproverRecentAll: [
        { headerName: "ID", field: "IDVal", hide: true, width: widthAction },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName, },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: true, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        { headerName: "Payment Terms", field: "PaymentTerms", hide: true, width: widthPaymentTerms },
        { headerName: "Approver", field: "Approver", hide: true, width: widthApprover },
        { headerName: "Approver Status", field: "ApproverStatus", hide: true, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: true, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: true, width: widthPaymentStatus },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: true, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Created", field: "Created", hide: true, width: widthCreated },
        { headerName: "Created by", field: "CreatedBy", hide: true, width: widthCreatedBy },
        { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy },
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },

      ],
      columnDefApproverNew: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthApprover },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefApproverApproved: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => {
            let oneDay = new Date();
            oneDay.setDate(oneDay.getDate() - 1);
            if ((new Date(item.data.CreatedForCheck) > oneDay && new Date(item.data.CreatedForCheck) <= new Date())) {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i>
                </div>
              )
            }
            else {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)} style={{ display: 'none' }}></i>
                </div>
              )
            }
          }
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefApproverRejected: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => {

            let oneDay = new Date();
            oneDay.setDate(oneDay.getDate() - 1);
            if ((new Date(item.data.CreatedForCheck) > oneDay && new Date(item.data.CreatedForCheck) <= new Date())) {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)}></i>
                </div>
              )
            }
            else {
              return (
                <div className={styles.linkFont}>
                  <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
                  <i className="fa fa-edit" aria-hidden="true" onClick={() => this.openViewPage(item)} style={{ display: 'none' }}></i>
                </div>
              )
            }
          }
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefApproverHold: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefApproverAll: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        { headerName: "Modified", field: "Modified", hide: true, width: widthModified },
        { headerName: "Modified by", field: "ModifiedBy", hide: true, width: widthModifiedBy }
      ],
      columnDefHRDashBoardWaitingForApproval: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },

        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },



        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefHRDashBoardHold: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },

        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },

        { headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRep, tooltipField: 'ServicesRep' },
        { headerName: "Finance Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefHRDashBoardApproved: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },

        { headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRep, tooltipField: 'ServicesRep' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefHRDashBoardReadyToBePaid: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },

        { headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRep, tooltipField: 'ServicesRep' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefHRDashBoardPaid: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        { headerName: "Payment Date", field: "PaymentDate", hide: false, width: widthPaymentDate },
        { headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRep, tooltipField: 'ServicesRep' },

        // { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        // { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefHRDashBoardRejected: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },

        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRep, tooltipField: 'ServicesRep' },
        { headerName: "Finance Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },

        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },

        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefHRDashBoardAll: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },

        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        { headerName: "Payment Date", field: "PaymentDate", hide: false, width: widthPaymentDate },
        //{ headerName: "Approver", field: "Approver", hide: false, width: widthApprover },


        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },



        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },

        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],



      columnDefSRDNew: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefSRDHold: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },


        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },

        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRep' },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },

        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // 
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // 
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefSRDApproved: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal, checkboxSelection: true, },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName, },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },


        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },

        //{ headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRep' },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefSRDReadyToBePaid: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal, checkboxSelection: true, },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },

        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },

        //{ headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRep' },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefSRDPaid: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        { headerName: "Payment Date", field: "PaymentDate", hide: false, width: widthPaymentDate },
        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },
        //{ headerName: "Finance Rep", field: "ServicesRep", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRep' },

        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },

        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },

        // { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefSRDRejected: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        // { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },


        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        // { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        // { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        { headerName: "Finance Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      columnDefSRDAll: [
        {
          headerName: "",
          field: "IDVal", width: widthAction,
          cellRendererFramework: (item: any) => <div className={styles.linkFont}>
            <i className="fa fa-paperclip" aria-hidden="true" onClick={() => this.onAttachmentClick(item)} style={{ paddingRight: '10px', paddingTop: '5px' }}></i>
            {/* <i className="fa fa-edit fa-2x" aria-hidden="true" onClick={() => this.openViewPage(item)}></i> */}
          </div>
        },
        { headerName: "ID", field: "IDVal", hide: false, width: widthIDVal },
        { headerName: "Consultant Name", field: "ConsultantName", hide: false, width: widthConsultantName },
        { headerName: "Assignment Id", field: "AssignmentId", hide: false, width: widthAssignmentId },
        { headerName: "Consultant Id", field: "ConsultantID", hide: false, width: widthConsultantID },
        { headerName: "Project Id", field: "ProjectId", hide: false, width: widthProjectId },
        { headerName: "Month of Service", field: "MonthofService", hide: false, width: widthMonthofService },
        { headerName: "Type of Service", field: "TypeofService", hide: false, width: widthTypeofService, tooltipField: 'TypeofService' },
        { headerName: "Invoice Amount", field: "InvoiceAmount", hide: false, width: widthInvoiceAmount },
        { headerName: "Service Description", field: "ServiceDescription", hide: false, width: widthServiceDescription, tooltipField: 'ServiceDescription' },
        { headerName: "Remarks", field: "Remarks", hide: false, width: widthRemarks, tooltipField: 'Remarks' },

        { headerName: "Pay By Date", field: "PayByDate", hide: false, width: widthPayByDate },
        { headerName: "Payment Date", field: "PaymentDate", hide: false, width: widthPaymentDate },
        // { headerName: "Approver", field: "Approver", hide: false, width: widthApprover },


        // { headerName: "Invoice Date", field: "InvoiceDate", hide: false, width: widthInvoiceDate, tooltipField: 'InvoiceDate' },


        // { headerName: "Payment Terms", field: "PaymentTerms", hide: false, width: widthPaymentTerms },
        { headerName: "Approver Status", field: "ApproverStatus", hide: false, width: widthApproverStatus },
        // { headerName: "Approver Remarks", field: "ApproverRemarks", hide: false, width: widthApproverRemarks },
        { headerName: "Payment Status", field: "PaymentStatus", hide: false, width: widthPaymentStatus },
        // { headerName: "Services Rep Remarks", field: "ServicesRepRemarks", hide: false, width: widthServicesRepRemarks, tooltipField: 'ServicesRepRemarks' },
        // { headerName: "Created", field: "Created", hide: false, width: widthCreated },
        // { headerName: "Created by", field: "CreatedBy", hide: false, width: widthCreatedBy },
        // { headerName: "Modified", field: "Modified", hide: false, width: widthModified },
        // { headerName: "Modified by", field: "ModifiedBy", hide: false, width: widthModifiedBy }
      ],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        //floatingFilter: true,
        //editable: true,
        unSortIcon: true,
        //suppressColumnMoveAnimation: true,
        wrapText: false,
        //autoHeight: true,
        //cellStyle: { 'white-space': 'normal', fontSize: '11px' },
        cellStyle: { fontSize: '10px', paddingLeft: '8px', paddingRight: '0px' },
        //cellStyle: (params: any) => { 
        // if (params.node.rowIndex % 2 === 1){
        //   return{backgroundColor: '#fff',fontSize: '10px', paddingLeft: '8px', paddingRight: '0px'};
        // }
        // else{
        //   return{backgroundColor: 'rgb(175 177 231)', fontSize: '10px', paddingLeft: '8px', paddingRight: '0px'};
        // }

        // },
        cellHeaderStyle: { fontSize: '11px' },
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: { 'white-space': 'normal', fontSize: '110px' },
        pagination: true,
        paginationPageSize: 30,


      }

    }
    this._sp = getSP();
  }



  private openViewPage = (e: any) => {

    debugger;
    if (e.data !== undefined) {
      //this.setState({ UploadInvoiceUrl: "https://flexipert.sharepoint.com/sites/UploadInvoice/SitePages/UploadInvoiceForm.aspx?ItemID=" + e.data.ID });

      window.open("https://flexipert.sharepoint.com/sites/UploadInvoice/SitePages/UploadInvoiceForm.aspx?ItemID=" + e.data.ID, "_blank");
    }
    else {
      //this.setState({ UploadInvoiceUrl: "https://flexipert.sharepoint.com/sites/UploadInvoice/SitePages/UploadInvoiceForm.aspx" });

      window.open("https://flexipert.sharepoint.com/sites/UploadInvoice/SitePages/UploadInvoiceForm.aspx", "_blank");
    }
    // var modal1 = document.getElementById("UploadInvoiceForm");
    // modal1.style.display = "block";

  }

  private openAprroverComment = (e: any, AppStat: string, StatusFor: string) => {
    let selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length !== 0) {
      this.setState({ AproverChoice: AppStat });
      this.setState({ StatusLebel: StatusFor });
      if (AppStat === "Rejected") {
        if (selectedData.length === 1) {
          var modal1 = document.getElementById("ApproverComment");
          modal1.style.display = "block";
        }
        else {
          alert("You can't Reject entries in bulk");
        }
      }
      else if (AppStat === "Hold") {
        if (selectedData.length === 1) {
          var modal1 = document.getElementById("ApproverComment");
          modal1.style.display = "block";
        }
        else {
          alert("You can't mark status as Hold for entries in bulk");
        }
      }
      else if (AppStat === "Approved") {
        var modal1 = document.getElementById("ApproverComment");
        modal1.style.display = "block";
      }
      else if (AppStat === "Ready to be Paid") {
        var modal1 = document.getElementById("ApproverComment");
        modal1.style.display = "block";
      }
      else if (AppStat === "Paid") {
        var modal1 = document.getElementById("ApproverComment");
        modal1.style.display = "block";
      }
    }
    else {
      alert("Please select at least one record");
    }
  }

  public componentDidMount() {
    let tempDate = new Date(this.state.loadStartDate);
    tempDate.setDate(tempDate.getDate() - 120);
    this.setState({ loadStartDate: tempDate });
    this.loadUploadInvoiceListData();
  }

  private gridOptions = (e: any) => {

  }

  private onAttachmentClick = async (e: any) => {
    debugger;

    var _sp = getSP();
    var spCache = spfi(this._sp);

    console.log(e.data);
    let supporttiveAttachment = await spCache.web.lists.getByTitle("UploadInvoiceSupportDocuments").items.select("AttachmentFiles").expand("AttachmentFiles").filter("Title eq " + e.data.ID)();
    if (e.data.Attachment.length > 0) {
      //window.open(e.data.Attachment[0].ServerRelativeUrl + "?web=1");
      this.setState({ viewAttachmentLink: e.data.Attachment })
      var modal = document.getElementById("AttachmentModel");
      modal.style.display = "block";
    }
    else {
      alert('No attachment found');
    }
    if (supporttiveAttachment.length > 0) {
      let tempSuppDocs = [];
      // for (let i = 0; i < supporttiveAttachment[0].AttachmentFiles.length; i++) {
      //   tempSuppDocs.push({ "FileName": supporttiveAttachment[0].AttachmentFiles[i].FileName, "Path": supporttiveAttachment[0].AttachmentFiles[i].ServerRelativeUrl });

      // }
      this.setState({ SupportiveDocs: supporttiveAttachment[0].AttachmentFiles });
      var modal = document.getElementById("AttachmentModel");
      modal.style.display = "block";
      //this.setState({SupportiveDocs: tempSuppDocs});
    }
    else {
      this.setState({ SupportiveDocs: [] });
    }

  }

  private spanClose(e: any) {
    var modal = document.getElementById("AttachmentModel");
    modal.style.display = "none";
  }

  private spanClose1(e: any) {
    //this.gridApi.applyTransaction(this.state.listDataAll);

    var modal1 = document.getElementById("UploadInvoiceForm");
    modal1.style.display = "none";

    //this.gridApi.refreshCells();
    //window.location.reload();

    this.loadUploadInvoiceListData();

  }

  private spanClose2(e: any) {
    var modal = document.getElementById("ApproverComment");
    modal.style.display = "none";
  }

  onGridReady = (params: any) => {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // if (params.data.ConsultantName === "Ratna Acharya") {
    //   return { 'background-color': 'yellow' }
    // }
    // return null;


  };

  private async loadUploadInvoiceListData() {

    var _sp = getSP();
    var spCache = spfi(this._sp);

    var today = new Date();
    var startDate15 = new Date();


    today.setDate(today.getDate() + 1);
    startDate15.setDate(today.getDate() - 15);

    var startDate30 = new Date();
    startDate30.setDate(today.getDate() - 30);

    var startDate60 = new Date();
    startDate60.setDate(today.getDate() - 60);

    var LoogedinUserEmail = this.props.context.user.loginName;

    let HRData = await spCache.web.lists.getByTitle("UploadInvoiceHR").items.select("HR/Name").expand("HR").filter("HR/Name eq 'i:0#.f|membership|" + LoogedinUserEmail + "'")();
    if (HRData.length > 0) {
      this.setState({ viewHRTab: true });
    }
    else {
      this.setState({ viewHRTab: false });
    }

    // let ServiceRepData = await spCache.web.lists.getByTitle("UploadInvoiceServiceRep").items.select("ServiceRep/Name").expand("ServiceRep").filter("ServiceRep/Name eq 'i:0#.f|membership|" + LoogedinUserEmail + "'")();
    // if (ServiceRepData.length > 0) {
    //   this.setState({ viewServiceRepTab: true });
    // }
    // else {
    //   this.setState({ viewServiceRepTab: false });
    // }


    let allData = [];

    allData = await spCache.web.lists.getByTitle("UploadInvoice").items.select("ID", "ConsultantName/Title", "ConsultantName/Name", "AssignmentId", "ConsultantID", "ProjectId", "TypeofService", "ServiceDescription", "InvoiceDate", "MonthofService", "InvoiceAmount", "Remarks", "PaymentTerms", "Approver/Title", "Approver/Name", "Approver/ID", "ApproverStatus", "ApproverRemarks", "PaymentStatus", "FinanceRep/Title", "ServicesRepRemarks", "Created", "Author/Title", "Author/Name", "Modified", "Editor/Title", "AttachmentFiles", "FinanceRep/Name", "DueDate", "PaymentDate").expand('Approver', 'ConsultantName', "AttachmentFiles", "Author", "Editor", "FinanceRep").orderBy("ID", false)();

    // let tempStart = new Date(this.state.loadStartDate);
    // let sMonth = tempStart.getMonth()+1;
    // let sDate = sMonth + "/" + tempStart.getDay() + "/" + tempStart.getFullYear();

    // let tempEnd = new Date(this.state.loadEndDate);
    // let eMonth = tempEnd.getMonth()+1;
    // let eDay = tempEnd.getDate() + 1;
    // let eDate = eMonth + "/" + eDay + "/" + tempEnd.getFullYear();

    // allData = await spCache.web.lists.getByTitle("UploadInvoice").items.select("ID", "ConsultantName/Title", "ConsultantName/Name", "AssignmentId", "ConsultantID", "ProjectId", "TypeofService", "ServiceDescription", "InvoiceDate", "MonthofService", "InvoiceAmount", "Remarks", "PaymentTerms", "Approver/Title", "Approver/Name", "Approver/ID", "ApproverStatus", "ApproverRemarks", "PaymentStatus", "ServicesRepRemarks", "Created", "Author/Title", "Author/Name", "Modified", "Editor/Title", "AttachmentFiles", "FinanceRep/Name").expand('Approver', 'ConsultantName', "AttachmentFiles", "Author", "Editor", "FinanceRep").filter("Created le '"+ eDate +"' and Created ge '"+ sDate + "'").orderBy("ID", false)();

    let managedDataAll = [];
    let ApproverMailCount = 0;
    let ConsultantMailCount = 0;
    let FinanceMailCount = 0;

    for (let i = 0; i < allData.length; i++) {
      let tempLoginMailIndex = allData[i].Author.Name.indexOf('|', 7);
      let CreatorMail = allData[i].Author.Name.substring(tempLoginMailIndex + 1);
      let ApproverMail = "";
      let ApproverTitle = "";
      let ApproverStatus = "";

      let ConsultantMail = "";
      let FinanceMail = "";
      let FinanceRepTitle = "";

      if (allData[i].Approver !== undefined) {
        let tempApproverMailIndex = allData[i].Approver.Name.indexOf('|', 7);
        ApproverMail = allData[i].Approver.Name.substring(tempApproverMailIndex + 1);
        ApproverTitle = allData[i].Approver.Title;
        ApproverStatus = allData[i].ApproverStatus;
        if (ApproverMail == LoogedinUserEmail) {
          ApproverMailCount = ApproverMailCount + 1;
        }

      }

      if (allData[i].ConsultantName !== undefined) {
        let tempConsultantMailIndex = allData[i].ConsultantName.Name.indexOf('|', 7);
        ConsultantMail = allData[i].ConsultantName.Name.substring(tempConsultantMailIndex + 1);
        if (ConsultantMail == LoogedinUserEmail) {
          ConsultantMailCount = ConsultantMailCount + 1;
        }

      }

      if (allData[i].FinanceRep !== undefined) {
        let tempFinanceMailIndex = allData[i].FinanceRep.Name.indexOf('|', 7);
        FinanceMail = allData[i].FinanceRep.Name.substring(tempFinanceMailIndex + 1);
        FinanceRepTitle = allData[i].FinanceRep.Title;
        if (FinanceMail == LoogedinUserEmail) {
          FinanceMailCount = FinanceMailCount + 1;
        }

      }



      managedDataAll.push({ "ID": allData[i].ID, "IDVal": allData[i].ID, "ConsultantName": allData[i].ConsultantName.Title, "AssignmentId": allData[i].AssignmentId, "ConsultantID": allData[i].ConsultantID, "ProjectId": allData[i].ProjectId, "TypeofService": allData[i].TypeofService, "ServiceDescription": allData[i].ServiceDescription, "InvoiceDate": dateFormat(allData[i].InvoiceDate, "mmm dd, yy"), "MonthofService": allData[i].MonthofService, "InvoiceAmount": allData[i].InvoiceAmount, "Remarks": allData[0].Remarks, "PaymentTerms": allData[i].PaymentTerms, "Approver": ApproverTitle, "ApproverEmail": ApproverMail, "ApproverStatus": ApproverStatus, "ApproverRemarks": allData[i].ApproverRemarks, "PaymentStatus": allData[i].PaymentStatus, "ServicesRepRemarks": allData[i].ServicesRepRemarks, "Created": new Date(allData[i].Created).toISOString().split('T')[0], "CreatedForCheck": allData[i].Created, "CreatedBy": allData[i].Author.Title, "Modified": new Date(allData[i].Modified).toISOString().split('T')[0], "ModifiedForCheck": allData[i].Modified, "ModifiedBy": allData[i].Editor.Title, "CreatorMail": CreatorMail, "Attachment": allData[i].AttachmentFiles, "FinanceMail": FinanceMail, "ServicesRep": FinanceRepTitle, "PayByDate": dateFormat(allData[i].DueDate, "mmm dd, yy"), "PaymentDate": dateFormat(allData[i].PaymentDate, "mmm dd, yy") }); /*"mmmm dS, yyyy"*/
    }

    if (ApproverMailCount > 0) {
      this.setState({ viewApproverTab: true });
    }
    else {
      this.setState({ viewApproverTab: false });
    }

    if (ConsultantMailCount > 0) {
      this.setState({ viewUserTab: true });
    }
    else {
      this.setState({ viewUserTab: false });
    }

    if (FinanceMailCount > 0) {
      this.setState({ viewFinanceTab: true });
    }
    else {
      this.setState({ viewFinanceTab: false });
    }



    let managedData15 = managedDataAll.filter((item: any) => {
      return (new Date(item.CreatedForCheck) > startDate15 && new Date(item.CreatedForCheck) <= new Date())
    });

    let oneDay = new Date();
    oneDay.setDate(oneDay.getDate() - 1);
    let managedData15EditInv = managedData15.filter((item: any) => {
      return (item.CreatorMail === LoogedinUserEmail)
    });

    let managedData15Rejected = managedData15.filter((item: any) => {
      return (item.PaymentStatus === "Rejected" && item.CreatorMail === LoogedinUserEmail);
    });

    let managedData15ApproverRejected = managedData15.filter((item: any) => {
      return (item.ApproverStatus === "Rejected" && item.CreatorMail === LoogedinUserEmail);
    });

    let managedData30 = managedDataAll.filter((item: any) => {
      return (item.CreatorMail === LoogedinUserEmail && item.CreatorMail === LoogedinUserEmail && new Date(item.CreatedForCheck) > startDate30 && new Date(item.CreatedForCheck) <= new Date())
    });

    let managedData60 = managedDataAll.filter((item: any) => {
      return (item.CreatorMail === LoogedinUserEmail && new Date(item.CreatedForCheck) > startDate60 && new Date(item.CreatedForCheck) <= new Date())
    });

    let managedDataAllMe = managedDataAll.filter((item: any) => {
      return (item.CreatorMail === LoogedinUserEmail)
    });

    let managedDataAllRejected = managedDataAll.filter((item: any) => {
      return (item.CreatorMail === LoogedinUserEmail && item.PaymentStatus === "Rejected" || item.ApproverStatus === "Rejected")
    });

    let managedData15ApproverAll = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail)
    });

    let managedData15ApproverNew = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "New")
    });


    let managedData15ApproverApproved = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "Approved")
    });

    let managedData15ApproverRejectedMe = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "Rejected")
    });

    let managedData15ApproverHold = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "Hold")
    });

    let managedDataApproverAll = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail)
    });

    let managedDataApproverNew = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "New")
    });

    let managedDataApproverApproved = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "Approved")
    });

    let managedDataApproverRejected = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "Rejected")
    });

    let managedDataApproverHold = managedDataAll.filter((item: any) => {
      return (item.ApproverEmail === LoogedinUserEmail && item.ApproverStatus === "Hold")
    });



    let managedDataHRApprovalNew = managedDataAll.filter((item: any) => {
      return (item.ApproverStatus === "New")
    });

    let managedDataHRApprovalHold = managedDataAll.filter((item: any) => {
      return (item.ApproverStatus === "Hold")
    });

    let managedDataHRApprovalApproved = managedDataAll.filter((item: any) => {
      return (item.ApproverStatus === "Approved")
    });

    let managedDataHRReadytobePaid = managedDataAll.filter((item: any) => {
      return (item.PaymentStatus === "Ready to be Paid")
    });

    let managedDataHRPaid = managedDataAll.filter((item: any) => {
      return (item.PaymentStatus === "Paid")
    });

    let managedDataHRApprovalRejected = managedDataAll.filter((item: any) => {
      return (item.ApproverStatus === "Rejected")
    });

    let managedDataSRDNew = managedDataAll.filter((item: any) => {
      return (item.ApproverStatus === "New" && item.FinanceMail === LoogedinUserEmail)
    });

    let managedDataSRDHold = managedDataAll.filter((item: any) => {
      return ((item.ApproverStatus === "Hold") && item.FinanceMail === LoogedinUserEmail)
    });

    let managedDataSRDApproved = managedDataAll.filter((item: any) => {
      return (item.ApproverStatus === "Approved" && (item.PaymentStatus === null || item.PaymentStatus === "New") && item.FinanceMail === LoogedinUserEmail)
    });

    let managedDataSRDReadyToBePaid = managedDataAll.filter((item: any) => {
      return (item.PaymentStatus === "Ready to be Paid" && item.FinanceMail === LoogedinUserEmail)
    });

    let managedDataSRDPaid = managedDataAll.filter((item: any) => {
      return (item.PaymentStatus === "Paid" && item.FinanceMail === LoogedinUserEmail)
    });

    let managedDataSRDRejected = managedDataAll.filter((item: any) => {
      return ((item.ApproverStatus === "Rejected") && item.FinanceMail === LoogedinUserEmail)
    });

    let managedDataSRDAll = managedDataAll.filter((item: any) => {
      return (item.FinanceMail === LoogedinUserEmail)
    });


    this.setState({ listData15: managedData15 });
    this.setState({ listData15EditInv: managedData15EditInv });
    this.setState({ listData15Rejected: managedData15Rejected });
    this.setState({ listData15ApproverRejected: managedData15ApproverRejected });
    this.setState({ listData30: managedData30 });
    this.setState({ listData60: managedData60 });
    this.setState({ listDataAll: managedDataAll });
    this.setState({ listDataAllMe: managedDataAllMe });
    this.setState({ listDataAllRejected: managedDataAllRejected });

    //Approver Section
    this.setState({ listData15ApproverNew: managedData15ApproverNew });
    this.setState({ listData15ApproverAll: managedData15ApproverAll });
    this.setState({ listData15ApproverApproved: managedData15ApproverApproved });
    this.setState({ listData15ApproverRejectedMe: managedData15ApproverRejectedMe });
    this.setState({ listData15ApproverHold: managedData15ApproverHold });
    this.setState({ listDataApproverNew: managedDataApproverNew });
    this.setState({ listDataApproverApproved: managedDataApproverApproved });
    this.setState({ listDataApproverRejected: managedDataApproverRejected });
    this.setState({ listDataApproverHold: managedDataApproverHold });
    this.setState({ listDataApproverAll: managedDataApproverAll });



    //HR Section
    this.setState({ listDataHRApprovalNew: managedDataHRApprovalNew });
    this.setState({ listDataHRApprovalHold: managedDataHRApprovalHold });
    this.setState({ listDataHRReadytobePaid: managedDataHRReadytobePaid });
    this.setState({ listDataHRApprovalApproved: managedDataHRApprovalApproved });
    this.setState({ listDataHRPaid: managedDataHRPaid });
    this.setState({ listDataHRApprovalRejected: managedDataHRApprovalRejected });

    //SRD section
    this.setState({ listDataSRDNew: managedDataSRDNew });
    this.setState({ listDataSRDHold: managedDataSRDHold });
    this.setState({ listDataSRDApproved: managedDataSRDApproved });
    this.setState({ listDataSRDReadyToBePaid: managedDataSRDReadyToBePaid });
    this.setState({ listDataSRDPaid: managedDataSRDPaid });
    this.setState({ listDataSRDRejected: managedDataSRDRejected });
    this.setState({ listDataSRDAll: managedDataSRDAll });

  }

  // private tabUser(e: any) {
  //   let tabName = e.key.indexOf(".") > -1 ? e.key.slice(1) : null;
  //   switch (tabName) {
  //     case "0":
  //       {
  //         break;
  //       }
  //     case "1":
  //       {
  //         debugger;


  //         //this.gridColumnApi.setColumnVisible('ID',false);
  //         this.gridColumnApi.setColumnVisible('ConsultantName', false);
  //         this.gridColumnApi.setColumnsVisible(['ConsultantName', 'AssignmentId'], false)
  //         break;
  //       }
  //     case "2":
  //       {
  //         debugger;

  //         break;
  //       }
  //     case "3":
  //       {
  //         console.log("3")
  //         break;
  //       }
  //     default:
  //       break;
  //   }
  // }

  // private tabUserRecent(e: any) {
  //   let tabName = e.key.indexOf(".") > -1 ? e.key.slice(1) : null;
  //   switch (tabName) {
  //     case "0":
  //       {
  //         console.log("0")
  //         break;
  //       }
  //     case "1":
  //       {
  //         console.log("1")
  //         break;
  //       }
  //     case "2":
  //       {
  //         console.log("2")
  //         break;
  //       }
  //     default:
  //       break;
  //   }
  // }

  // private tabApprover(e: any) {
  //   let tabName = e.key.indexOf(".") > -1 ? e.key.slice(1) : null;
  //   switch (tabName) {
  //     case "0":
  //       {
  //         console.log("0")
  //         break;
  //       }
  //     case "1":
  //       {
  //         console.log("1")
  //         break;
  //       }
  //     default:
  //       break;
  //   }
  // }

  // private tabApproverRecent(e: any) {
  //   let tabName = e.key.indexOf(".") > -1 ? e.key.slice(1) : null;
  //   switch (tabName) {
  //     case "0":
  //       {
  //         console.log("0")
  //         break;
  //       }
  //     case "1":
  //       {
  //         console.log("1")
  //         break;
  //       }
  //     case "2":
  //       {
  //         console.log("2")
  //         break;
  //       }
  //     case "3":
  //       {
  //         console.log("3")
  //         break;
  //       }
  //     default:
  //       break;
  //   }
  // }

  // private tabHRDashboard(e: any) {
  //   let tabName = e.key.indexOf(".") > -1 ? e.key.slice(1) : null;
  //   switch (tabName) {
  //     case "0":
  //       {
  //         console.log("0")
  //         break;
  //       }
  //     case "1":
  //       {
  //         console.log("1")
  //         break;
  //       }
  //     case "2":
  //       {
  //         console.log("2")
  //         break;
  //       }
  //     case "3":
  //       {
  //         console.log("3")
  //         break;
  //       }
  //     case "4":
  //       {
  //         console.log("4")
  //         break;
  //       }
  //     case "5":
  //       {
  //         console.log("5")
  //         break;
  //       }
  //     default:
  //       break;
  //   }
  // }

  // private tabServiceSupDashboard(e: any) {
  //   let tabName = e.key.indexOf(".") > -1 ? e.key.slice(1) : null;
  //   switch (tabName) {
  //     case "0":
  //       {
  //         console.log("0")
  //         break;
  //       }
  //     case "1":
  //       {
  //         console.log("1")
  //         break;
  //       }
  //     case "2":
  //       {
  //         console.log("2")
  //         break;
  //       }
  //     case "3":
  //       {
  //         console.log("3")
  //         break;
  //       }
  //     case "4":
  //       {
  //         console.log("4")
  //         break;
  //       }
  //     case "5":
  //       {
  //         console.log("5")
  //         break;
  //       }
  //     default:
  //       break;
  //   }
  // }

  private onBtncheck(e: any) {
    debugger;
    console.log(e);
  }

  private loadMainData() {
    this.loadUploadInvoiceListData();
  }

  private dtpEndSelection = (e: any) => {
    debugger;
    console.log(e);
  }

  private async getSelectedRowinGrid(approvalVal: any) {
    let selectedData = this.gridApi.getSelectedRows();
    if (this.state.StatusLebel === "ApproverStatus") {
      if ((approvalVal === "Approved") || (this.state.appRemarks !== '')) {
        var _sp = getSP();
        var spCache = spfi(this._sp);
        for (let i = 0; i < selectedData.length; i++) {
          let createBatchRequest = await spCache.web.lists.getByTitle("UploadInvoice").items.getById(selectedData[i].ID).update({
            ApproverRemarks: this.state.appRemarks,
            //ProjectMembersId: loggedInUserPropertiesId,
            ApproverStatus: approvalVal,
          }).then(() => {
            this.setState({ appRemarks: '' });
            this.loadUploadInvoiceListData();
          }).catch(() => {
            alert("Data is not updated successfully. Please contact with your Administrator");
          });


          this.gridApi.applyTransaction({ remove: [selectedData[i]] });

        }

        var modal = document.getElementById("ApproverComment");
        modal.style.display = "none";

        //this.gridApi.applyTransaction({ remove: [this.state.listData15EditInv[0]]});
      }
      else {
        alert('Please add some remarks');
      }
    }
    else if (this.state.StatusLebel === "PaymentStatus") {
      if ((approvalVal === "Ready to be Paid") || (approvalVal === "Paid") || (this.state.appRemarks !== '')) {
        var _sp = getSP();
        var spCache = spfi(this._sp);
        let goAhead = true;
        if (approvalVal === "Paid" && this.state.FinalPaymentDate === '') {
          goAhead = false;
        }

        if (goAhead) {
          for (let i = 0; i < selectedData.length; i++) {

            if (approvalVal !== "Paid") {
              let createBatchRequest = await spCache.web.lists.getByTitle("UploadInvoice").items.getById(selectedData[i].ID).update({
                ApproverRemarks: this.state.appRemarks,
                PaymentStatus: approvalVal,

              }).then(() => {
                if (i === (selectedData.length - 1)) {
                  this.setState({ appRemarks: '' });
                  this.loadUploadInvoiceListData();
                  var modal = document.getElementById("ApproverComment");
                  modal.style.display = "none";
                }
              }).catch(() => {
                alert("Data is not updated successfully. Please contact with your Administrator");
              });
            }
            else {
              let createBatchRequest = await spCache.web.lists.getByTitle("UploadInvoice").items.getById(selectedData[i].ID).update({
                ApproverRemarks: this.state.appRemarks,
                PaymentStatus: approvalVal,
                PaymentDate: this.state.FinalPaymentDate
              }).then(() => {
                if (i === (selectedData.length - 1)) {
                  this.setState({ appRemarks: '', FinalPaymentDate: '' });
                  this.loadUploadInvoiceListData();
                  var modal = document.getElementById("ApproverComment");
                  modal.style.display = "none";
                }
              }).catch(() => {
                alert("Data is not updated successfully. Please contact with your Administrator");
              });
            }
          }
          //this.gridApi.applyTransaction({ remove: [selectedData[i]] });
        }
        else {
          alert("Please provide the Payment Date");
        }
        //this.gridApi.applyTransaction({ remove: [this.state.listData15EditInv[0]]});
      }
      else {
        alert('Please add some remarks');
      }
    }
  }

  private _onSelectVisitingDateFrom = (date: Date | null | undefined): void => {
    this.setState({ FinalPaymentDate: date });
  };

  public render(): React.ReactElement<IDashboardProps> {
    return (
      <div>
        <div className={styles.UploadInvoice} >

          {/* <label style={{ cursor: "pointer" }} onClick={() => this.openViewPage(this)}><b>Upload Invoice: </b></label>
          
          <i className="fa fa-plus fa-2x" aria-hidden="true" style={{ paddingLeft: '10px', paddingTop: '5px', cursor: "pointer" }} onClick={() => this.openViewPage(this)}></i> */}

          <DefaultButton
            text="Upload Invoice"
            iconProps={addIcon}
            onClick={() => this.openViewPage(this)}
          //label="Submit"
          //allowDisabledFocus
          //disabled={disabled}
          //checked={checked} 
          />

        </div>


        {/* <div className="row">
          <div className="col-md-8">

          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-6">
                 <label><b>Upload Inovoice: </b></label> 
              </div>
              <div className="col-md-6">
                 <i className="fa fa-plus fa-2x" aria-hidden="true" style={{ paddingLeft: '10px', paddingTop: '5px' }}></i> 
                <DefaultButton
                  text="Upload Invoice"
                  iconProps={addIcon}
                  onClick={() => this.openViewPage(this)}
                //label="Submit"
                //allowDisabledFocus
                //disabled={disabled}
                //checked={checked} 
                />
              </div>
            </div>
          </div>

        </div> */}

        <div id="AttachmentModel" className={styles.modal}>

          <div className={styles['modal-content']} style={{ width: '50%' }}>
            <div className={styles["modal-header"]}>
              <span className={styles["close"]} onClick={() => this.spanClose(this)}>&times;</span>
              <h2>Attachment Links</h2>
            </div>
            <div className={styles["modal-body"]}>
              
              {this.state.viewAttachmentLink.map((item: any, index: any) => {
                return (
                  <div className={styles.attachmentFiles}>
                    <label>Attachment {index + 1}: &nbsp;</label>
                    {/* <a href={item.ServerRelativeUrl} target="_blank">{item.FileName}</a> */}
                    <a href="#" onClick={() => {
                      window.open(item.ServerRelativeUrl);
                      return false;
                    }}>{item.FileName}</a>
                  </div>
                );
              })}
              {this.state.SupportiveDocs.length > 0 ? (
                <div className={styles.attachmentFiles}>
                  {this.state.SupportiveDocs.map((item: any, index: any) => {
                    console.log(item);
                    return (
                      <div>
                        <label>Supportive Document {index + 1}: &nbsp;</label>
                        <a href="#" onClick={() => {
                          window.open(item.ServerRelativeUrl);
                          return false;
                        }}>{item.FileName}</a>
                      </div>
                    )
                  })}
                </div>
              ) : ("")}
            </div>
            <div className={styles["modal-footer"]}>
              <h3></h3>
            </div>
          </div>

        </div>


        <div id="ApproverComment" className={styles.modal} >

          <div className={styles['modal-content']} style={{ width: '50%' }}>
            <div className={styles["modal-header"]}>
              <span className={styles["close"]} onClick={() => this.spanClose2(this)}>&times;</span>
              <h2>Remarks</h2>
            </div>
            <div className={styles["modal-body"]}>

              <div className='row'>
                <TextField
                  label="Remarks"
                  multiline rows={3}
                  value={this.state.appRemarks}
                  onChange={(e, i) => this.setState({ appRemarks: i })}
                />
                {this.state.AproverChoice === "Paid" ? (
                  <div style={{ marginTop: '10px' }}>

                    <DatePicker
                      placeholder="Select a date..."
                      //isRequired={true}
                      //minDate={this.state.VisitingDateFrom}
                      maxDate={new Date()}
                      label='Payment Date'
                      onSelectDate={this._onSelectVisitingDateFrom}
                      value={this.state.FinalPaymentDate}
                      //formatDate={this._onFormatDate}
                      isMonthPickerVisible={true}
                      id='dtpFrom'
                    />
                  </div>
                ) : ("")}
              </div>
              <div className='row' style={{ marginTop: '10px' }}>
                <div className="col-md-6">
                  <DefaultButton
                    text={this.state.AproverChoice}
                    //iconProps={AcceptMediumIcon}
                    onClick={() => this.getSelectedRowinGrid(this.state.AproverChoice)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="col-md-6">
                  <DefaultButton
                    text="Cancel"
                    //iconProps={AcceptMediumIcon}
                    onClick={() => this.spanClose2(this)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
            <div className={styles["modal-footer"]}>
              <h3></h3>
            </div>
          </div>

        </div>



        <div id="UploadInvoiceForm" className={styles.modal}>

          <div className={styles['modal-content']}>
            <div className={styles["modal-header"]}>
              <span className={styles["close"]} onClick={() => this.spanClose1(this)}>&times;</span>
              <h2>Upload Invoice</h2>
            </div>
            <div className={styles["modal-body"]} style={{ height: '480px' }}>
              <iframe src={this.state.UploadInvoiceUrl} style={{ width: '100%', height: '100%' }}></iframe>
            </div>
            <div className={styles["modal-footer"]}>
              <h3></h3>
            </div>
          </div>

        </div>


        {this.state.listDataAll[0] != undefined ? (
          <div>
            <div className='row'>
              <Pivot className={styles.pivotControl1stLayer}>

                {this.state.viewUserTab ? (
                  <PivotItem headerText="User" className={styles.tabHeader}
                  // onRenderItemLink={(properties, nullableDefaultRenderer) => {
                  //   return (
                  //     <TooltipHost content="This tab control is for User. User can see their uploaded invoice and also they can modify their invoice which are uploaded before 24 hours of time">
                  //       {nullableDefaultRenderer(properties)}
                  //     </TooltipHost>
                  //   )
                  // }}
                  >
                    <Pivot className={styles.pivotControl1stLayer}>
                      <PivotItem headerText="Recent (15 Days)"
                      // onRenderItemLink={(properties, nullableDefaultRenderer) => {
                      //   return (
                      //     <TooltipHost content="This tab control is for User. User can see their uploaded invoice and also they can modify their invoice which are uploaded before 24 hours of time">
                      //       {nullableDefaultRenderer(properties)}
                      //     </TooltipHost>
                      //   )
                      // }}
                      >
                        <Pivot className={styles.pivotControl1stLayer}>
                          <PivotItem headerText="Invoice Details"
                          // onRenderItemLink={(properties, nullableDefaultRenderer) => {
                          //   return (
                          //     <TooltipHost content="This tab control is for User. User can see their uploaded invoice and also they can modify their invoice which are uploaded before 24 hours of time">
                          //       {nullableDefaultRenderer(properties)}
                          //     </TooltipHost>
                          //   )
                          // }}
                          >
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div style={{ padding: '10px' }}><b><label style={{ color: 'red' }}><i className="fa fa-star" aria-hidden="true" ></i>You can modify the entries within first 24 hours only</label></b></div>
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefRecentEditInvoice}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15EditInv}
                                      // pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      enableBrowserTooltips={true}
                                      tooltipShowDelay={0}
                                      gridOptions={gridOptions}
                                    //rowHeight={200}
                                    //tooltipHideDelay={2000}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Claim Rejected by Finance" >
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div style={{ padding: '10px' }}><b><label style={{ color: 'red' }}><i className="fa fa-star" aria-hidden="true" ></i>For any related query please send mail to <a href="mailto: hr.support@flexipert.com">hr.support@flexipert.com</a></label></b></div>
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefRecentClaimRejected}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15Rejected}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Claim Rejected by Approver">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div style={{ padding: '10px' }}><b><label style={{ color: 'red' }}><i className="fa fa-star" aria-hidden="true" ></i>For any related query please send mail to <a href="mailto: hr.support@flexipert.com">hr.support@flexipert.com</a></label></b></div>
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefRecentClaimRejectedbyApprover}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15ApproverRejected}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>
                        </Pivot>
                      </PivotItem>

                      <PivotItem headerText="30 Days">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDef30Days}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listData30}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="60 Days">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDef60Days}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listData60}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="All">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefAllDays}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataAllMe}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Rejected">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefRejected}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataAllRejected}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                    </Pivot>
                  </PivotItem>
                ) : ("")}

                {this.state.viewApproverTab ? (


                  <PivotItem headerText="Approver" 
                  // onRenderItemLink={(properties, nullableDefaultRenderer) => {
                  //   return (
                  //     <TooltipHost content="This tab control is for User. User can see their uploaded invoice and also they can modify their invoice which are uploaded before 24 hours of time">
                  //       {nullableDefaultRenderer(properties)}
                  //     </TooltipHost>
                  //   )
                  // }}
                  >
                    <Pivot className={styles.pivotControl1stLayer}>

                      <PivotItem headerText="Pending">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div>
                                <div className='row'>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Approve"
                                      //className="btn btn-success"
                                      iconProps={AcceptMediumIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Approved", "ApproverStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#28a745', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Reject"
                                      iconProps={StatusErrorFullIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Rejected", "ApproverStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Hold"
                                      //iconProps={ArrangeBringToFrontIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Hold", "ApproverStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#17a2b8', color: '#fff' }}
                                    />
                                  </div>
                                  <br /><br />
                                </div>
                              </div>
                              <div>
                                <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                  <AgGridReact
                                    columnDefs={this.state.columnDefApproverRecentNew}
                                    defaultColDef={this.state.defaultColDef}
                                    rowData={this.state.listData15ApproverNew}
                                    //pagination={true} paginationPageSize={5}
                                    animateRows={true}
                                    gridOptions={gridOptions}
                                    onGridReady={this.onGridReady}
                                    columnHoverHighlight={true}
                                    rowSelection={'multiple'}
                                    rowMultiSelectWithClick={true}
                                  //rowSelection={'single'}
                                  //onSelectionChanged={e => this.AGChange(e)}
                                  >
                                  </AgGridReact>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Approved">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefApproverRecentApproved}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listData15ApproverApproved}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Rejected">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefApproverRecentRejected}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listData15ApproverRejectedMe}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Hold">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div>
                                <div className='row'>
                                  <div className="col-md-6">
                                    <DefaultButton
                                      text="Approve"
                                      iconProps={AcceptMediumIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Approved", "ApproverStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#28a745', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <DefaultButton
                                      text="Reject"
                                      iconProps={StatusErrorFullIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Rejected", "ApproverStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff' }}
                                    />
                                  </div>

                                  <br /><br />
                                </div>
                              </div>
                              <div>
                                <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                  <AgGridReact
                                    columnDefs={this.state.columnDefApproverRecentHold}
                                    defaultColDef={this.state.defaultColDef}
                                    rowData={this.state.listData15ApproverHold}
                                    //pagination={true} paginationPageSize={5}
                                    animateRows={true}
                                    gridOptions={gridOptions}
                                    onGridReady={this.onGridReady}
                                    columnHoverHighlight={true}
                                    rowSelection={'multiple'}
                                    rowMultiSelectWithClick={true}
                                  >
                                  </AgGridReact>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="All Data">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefApproverRecentAll}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listData15ApproverAll}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>



                      {/* <PivotItem headerText="Recent">
                        <Pivot className={styles.pivotControl1stLayer}>
                          <PivotItem headerText="Pending">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div>
                                    <div className='row'>
                                      <div className="col-md-4">
                                        <DefaultButton
                                          text="Approve"
                                          //className="btn btn-success"
                                          iconProps={AcceptMediumIcon}
                                          onClick={(item: any) => {
                                            this.openAprroverComment(item, "Approved");
                                          }}
                                          style={{ width: '100%', backgroundColor: '#28a745', color: '#fff'}}
                                        />
                                      </div>
                                      <div className="col-md-4">
                                        <DefaultButton
                                          text="Reject"
                                          iconProps={StatusErrorFullIcon}
                                          onClick={(item: any) => {
                                            this.openAprroverComment(item, "Rejected");
                                          }}
                                          style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff' }}
                                        />
                                      </div>
                                      <div className="col-md-4">
                                        <DefaultButton
                                          text="Hold"
                                          //iconProps={ArrangeBringToFrontIcon}
                                          onClick={(item: any) => {
                                            this.openAprroverComment(item, "Hold");
                                          }}
                                          style={{ width: '100%', backgroundColor: '#17a2b8', color: '#fff' }}
                                        />
                                      </div>
                                      <br /><br />
                                    </div>
                                  </div>
                                  <div>
                                    <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                      <AgGridReact
                                        columnDefs={this.state.columnDefApproverRecentNew}
                                        defaultColDef={this.state.defaultColDef}
                                        rowData={this.state.listData15ApproverNew}
                                        //pagination={true} paginationPageSize={5}
                                        animateRows={true}
                                        gridOptions={gridOptions}
                                        onGridReady={this.onGridReady}
                                        columnHoverHighlight={true}
                                        rowSelection={'multiple'}
                                        rowMultiSelectWithClick={true}
                                      //rowSelection={'single'}
                                      //onSelectionChanged={e => this.AGChange(e)}
                                      >
                                      </AgGridReact>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Approved">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverRecentApproved}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15ApproverApproved}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Rejected">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverRecentRejected}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15ApproverRejectedMe}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Hold">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                <div>
                                    <div className='row'>
                                      <div className="col-md-6">
                                        <DefaultButton
                                          text="Approve"
                                          iconProps={AcceptMediumIcon}
                                          onClick={(item: any) => {
                                            this.openAprroverComment(item, "Approved");
                                          }}
                                          style={{ width: '100%', backgroundColor: '#28a745', color: '#fff' }}
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <DefaultButton
                                          text="Reject"
                                          iconProps={StatusErrorFullIcon}
                                          onClick={(item: any) => {
                                            this.openAprroverComment(item, "Rejected");
                                          }}
                                          style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff' }}
                                        />
                                      </div>
                                      
                                      <br /><br />
                                    </div>
                                  </div>
                                  <div>
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverRecentHold}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15ApproverHold}
                                      //pagination={true} paginationPageSize={5}
                                        animateRows={true}
                                        gridOptions={gridOptions}
                                        onGridReady={this.onGridReady}
                                        columnHoverHighlight={true}
                                        rowSelection={'multiple'}
                                        rowMultiSelectWithClick={true}
                                    >
                                    </AgGridReact>
                                  </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="All Data">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverRecentAll}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listData15ApproverAll}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                        </Pivot>
                      </PivotItem>

                      <PivotItem headerText="All">
                        <Pivot className={styles.pivotControl1stLayer}>
                          <PivotItem headerText="Pending">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverNew}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listDataApproverNew}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Approved">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverApproved}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listDataApproverApproved}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Rejected">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverRejected}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listDataApproverRejected}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="Hold">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverHold}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listDataApproverHold}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>

                          <PivotItem headerText="All Data">
                            <div className="col-md-12">
                              <div className="card">
                                <div className="card-body position-relative">
                                  <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                    <AgGridReact
                                      columnDefs={this.state.columnDefApproverRecent}
                                      defaultColDef={this.state.defaultColDef}
                                      rowData={this.state.listDataApproverAll}
                                      //pagination={true} paginationPageSize={5}
                                      animateRows={true}
                                      gridOptions={gridOptions}
                                    //rowSelection={'single'}
                                    //onSelectionChanged={e => this.AGChange(e)}
                                    >
                                    </AgGridReact>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PivotItem>
                        </Pivot>
                      </PivotItem> */}
                    </Pivot>
                  </PivotItem>
                ) : ("")}

                {this.state.viewHRTab ? (
                  <PivotItem headerText="HR Dashboard" style={{ display: 'block' }}>
                    <Pivot className={styles.pivotControl1stLayer}>
                      <PivotItem headerText="Waiting for Approval">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardWaitingForApproval}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataHRApprovalNew}
                                  //pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Hold">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardHold}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataHRApprovalHold}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Approved">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardApproved}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataHRApprovalApproved}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Ready to be Paid">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardReadyToBePaid}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataHRReadytobePaid}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Paid">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardPaid}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataHRPaid}
                                  //  pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="Rejected">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardRejected}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataHRApprovalRejected}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>

                      <PivotItem headerText="All">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefHRDashBoardAll}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataAll}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                    </Pivot>
                  </PivotItem>
                ) : ("")}

                {this.state.viewFinanceTab ? (
                  <PivotItem headerText="Finance Rep Dashboard">
                    <Pivot className={styles.pivotControl1stLayer}>
                      <PivotItem headerText="Waiting for Approval">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">

                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDNew}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDNew}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                      <PivotItem headerText="Hold">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDHold}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDHold}
                                  //  pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                      <PivotItem headerText="Approved">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div>
                                <div className='row'>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Ready to be Paid"
                                      //className="btn btn-success"
                                      iconProps={AcceptMediumIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Ready to be Paid", "PaymentStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#28a745', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Reject"
                                      iconProps={StatusErrorFullIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Rejected", "PaymentStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Hold"
                                      //iconProps={ArrangeBringToFrontIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Hold", "PaymentStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#17a2b8', color: '#fff' }}
                                    />
                                  </div>
                                  <br /><br />
                                </div>
                              </div>
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDApproved}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDApproved}
                                  //  pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                  onGridReady={this.onGridReady}
                                  columnHoverHighlight={true}
                                  rowSelection={'multiple'}
                                  rowMultiSelectWithClick={true}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                      <PivotItem headerText="Ready to be Paid">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div>
                                <div className='row'>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Paid"
                                      //className="btn btn-success"
                                      iconProps={AcceptMediumIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Paid", "PaymentStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#28a745', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Reject"
                                      iconProps={StatusErrorFullIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Rejected", "PaymentStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff' }}
                                    />
                                  </div>
                                  <div className="col-md-4">
                                    <DefaultButton
                                      text="Hold"
                                      //iconProps={ArrangeBringToFrontIcon}
                                      onClick={(item: any) => {
                                        this.openAprroverComment(item, "Hold", "PaymentStatus");
                                      }}
                                      style={{ width: '100%', backgroundColor: '#17a2b8', color: '#fff' }}
                                    />
                                  </div>
                                  <br /><br />
                                </div>
                              </div>
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDReadyToBePaid}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDReadyToBePaid}
                                  //  pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                  onGridReady={this.onGridReady}
                                  columnHoverHighlight={true}
                                  rowSelection={'multiple'}
                                  rowMultiSelectWithClick={true}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                      <PivotItem headerText="Paid">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDPaid}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDPaid}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                      <PivotItem headerText="Rejected">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDRejected}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDRejected}
                                  //  pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                      <PivotItem headerText="All">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body position-relative">
                              <div className={["ag-theme-alpine", styles['ag-theme-alpine']].join(' ')} style={{ height: "450px" }}>
                                <AgGridReact
                                  columnDefs={this.state.columnDefSRDAll}
                                  defaultColDef={this.state.defaultColDef}
                                  rowData={this.state.listDataSRDAll}
                                  // pagination={true} paginationPageSize={5}
                                  animateRows={true}
                                  gridOptions={gridOptions}
                                //rowSelection={'single'}
                                //onSelectionChanged={e => this.AGChange(e)}
                                >
                                </AgGridReact>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PivotItem>
                    </Pivot>
                  </PivotItem>
                ) : ("")}

              </Pivot>
            </div>
          </div>
        ) : (
          <div>
            <Spinner
              label="Page Loading, Please wait..."
            />
          </div>
        )}


      </div>
    );
  }
}

