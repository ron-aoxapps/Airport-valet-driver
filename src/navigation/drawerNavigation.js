import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SCREEN_NAMES} from '../config';
import DrawerContent from './component/DrawerContent';
import {
  DashBoard,
  MyBooking,
  Coupons,
  Editprofile,
  Setting,
  Vehicles,
} from '../container/app';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {backgroundColor: 'transparent'},
      }}>
      <Drawer.Screen name={SCREEN_NAMES.DashBoard} component={DashBoard} />
      <Drawer.Screen name={SCREEN_NAMES.MyBooking} component={MyBooking} />
      <Drawer.Screen name={SCREEN_NAMES.Coupons} component={Coupons} />
      <Drawer.Screen name={SCREEN_NAMES.Editprofile} component={Editprofile} />
      <Drawer.Screen name={SCREEN_NAMES.Setting} component={Setting} />
      <Drawer.Screen name={SCREEN_NAMES.Vehicles} component={Vehicles} />
    </Drawer.Navigator>
  );
}

export default MyDrawer;