const express=require('express')
const model=require(../models/userModel);

const userRoles = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    LANDLORD: 'Landlord',
    BROKER: 'Broker',
    RENTER: 'Renter'
  };
  
  const permissions = {
    SUPER_ADMIN: {
      createAccount: true,
      updateAccount: true,
      deleteAccount: true,
      blockUser: true,
      unblockUser: true,
      // Add more permissions as needed
    },
    ADMIN: {
      verifyUser: true,
      // Add more permissions as needed
    },
    LANDLORD: {
      listProperties: true,
      editProperties: true,
      deleteProperties: true,
      manageRequests: true,
      // Add more permissions as needed
    },
    BROKER: {
      listProperties: true,
      manageRequests: true,
      // Add more permissions as needed
    },
    RENTER: {
      searchProperties: true,
      viewPropertyDetails: true,
      initiateRequest: true,
      manageProfile: true,
      viewHistory: true,
      // Add more permissions as needed
    }
  };
  
  // Example usage:
  const user = {
    role: userRoles.SUPER_ADMIN
  };
  
  const userPermissions = permissions[user.role];
  
  console.log(`User role: ${user.role}`);
  console.log('Permissions:');
  for (const [permission, value] of Object.entries(userPermissions)) {
    console.log(`${permission}: ${value}`);
  }
  