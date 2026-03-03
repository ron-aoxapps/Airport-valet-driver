//do not change these status without backend permissions

export const CONSTANTS = {
  FindingDrivers: 'FindingDrivers',
  Completed: 'Completed',
  Accepted: 'Accepted',
  Cancelled: 'Cancelled',
  Rejected: 'Rejected',
  PickupInRoute: 'PickupInroute',
  PickupArrived: 'PickupArrived',
  Pickup: 'Pickup',

  ParkingInRoute: 'ParkingInroute',
  ReturnInRoute: 'ReturnInroute',
  ReturnArrived: 'ReturnArrived',
  Parked: 'Parked',

  PENDING_BOOKINGS: 'PENDING',
  COMPLETED_BOOKINGS: 'COMPLETED',
};

export const bookingStatus = (status) => {

  switch (status) {
    case CONSTANTS.FindingDrivers:
      return 'Not Confirmed'
    case CONSTANTS.Accepted:
      return 'Accepted'
    case CONSTANTS.Cancelled:
      return 'Cancelled'
    case CONSTANTS.PickupInRoute:
      return 'Pickup In Route'
    case CONSTANTS.PickupArrived:
      return 'Arrived For Pickup'
    case CONSTANTS.ParkingInRoute:
      return 'Parking In Route'

    case CONSTANTS.Parked:
      return 'Parked'
    case CONSTANTS.ReturnInRoute:
      return 'Return In Route'
    case CONSTANTS.ReturnArrived:
      return 'Arrived For Return'

    case CONSTANTS.Completed:
      return 'Completed' 


    default: ''
      break;
  }




}

