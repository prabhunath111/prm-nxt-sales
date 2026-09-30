import { gql } from '@apollo/client';

export const getDealerInfoForStoreDashboard = gql`
  query GetEvdDetails($input: DealerInput) {
    getEvdDetails(input: $input) {
      userId
      roleId
      roleName
      name
      userStatus
      mdn
      status
      channelType
      outletType
    }
  }
`;

export const getStoreClosingData = gql`
  query GetStoreChecklist($input: StoreChecklistInput) {
    getStoreChecklist(input: $input) {
      isEligible
      questions {
        id
        question
        response
      }
    }
  }
`;

export const getStoreOperationalReport = gql`
  query GetStoreChecklistMonthly($input: StoreChecklistMonthlyInput) {
    getStoreChecklistMonthly(input: $input) {
      isEligible
      tableColumns
      dashBoardWalkInData {
        createdDate
        noOfWalkIns
        phoneLeads
        teleCallingLead
        outboundActivation
        recharge
        newConnection
        serviceComplaint
        enquiryNewConnection
        enquiryPack
        boxUpgrade
        vasSales
      }
    }
  }
`;
