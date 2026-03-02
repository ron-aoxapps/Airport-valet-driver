import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Images, Strings} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import {SCREEN_NAMES} from '../../config';
import {useNavigation} from '@react-navigation/native';
import {clearUserId} from '../../utils/authentication';
import {setConfiguration} from '../../utils/configuration';
import {ImageLoading, Text} from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import {commonStyle} from '../../styles/styles';
import {useProfileSelector} from '../../module/customSelector';

const menuItems = [
  {
    name: Strings.DashBoard,
    icon: Images.home,
    screen: SCREEN_NAMES.DashBoard,
  },
  {
    name: Strings.mybooking,
    icon: Images.bookings,
    screen: SCREEN_NAMES.MyBooking,
  },
  {
    name: Strings.Editprofile,
    icon: Images.profile,
    screen: SCREEN_NAMES.Editprofile,
  },
  {
    name: Strings.setting,
    icon: Images.setting,
    screen: SCREEN_NAMES.Setting,
  },
];

const DrawerContent = props => {
  const navigation = useNavigation();
  const profileData = useProfileSelector();

  const onLogout = async () => {
    navigation.reset({routes: [{name: 'Auth'}]});
    await clearUserId();
    setConfiguration('token', '');
    setConfiguration('user_id', '');
  };

  const _backButton = () => {
    return (
      <View style={styles.closeIconContainer}>
        <TouchableOpacity
          style={styles.drawerCloseIcon}
          onPress={() => props.navigation.toggleDrawer()}>
          <Icon name="left" size={22} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const Profile = () => {
    return (
      <View style={[commonStyle.row, styles.profileContainer]}>
        <ImageLoading
          loadingColor="white"
          style={styles.userImage}
          source={
            profileData?.profileImage == null || profileData?.profileImage == ''
              ? Images.dumpProfile
              : {uri: profileData?.profileImage}
          }
        />
        <View style={styles.profile}>
          <Text textColor={'white'} bold medium>
            {profileData?.name}
          </Text>
          <Text textColor={'white'} bold medium>
            {profileData?.email}
          </Text>
        </View>
      </View>
    );
  };

  const onPressHandler = (item) => {
    if (item.screen === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout', [
        {text: 'Yes', onPress: () => onLogout()},
        {text: 'No'},
      ]);
    } else {
      // Navigate to the Drawer navigator first, then to the specific screen
      navigation.navigate(SCREEN_NAMES.DrawerNavigation, {
        screen: item.screen
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {_backButton()}
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={() => <Profile />}
        data={menuItems}
        renderItem={({item, index}) => (
          <MenuItem
            item={item}
            onPress={() => onPressHandler(item)}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <MenuItem
        item={{
          name: 'Log out',
          icon: Images.logout,
          screen: 'logout',
        }}
        onPress={() => onPressHandler({screen: 'logout'})}
      />
    </SafeAreaView>
  );
};

export default DrawerContent;

const MenuItem = ({item, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.menuItem}>
      <Image source={item.icon} style={styles.menuIcon} />
      <Text medium textColor={'black'} style={styles.menuItemText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS == 'android' ? 10 : 0,
  },
  container: {
    paddingTop: '10%',
    backgroundColor: Colors.primary,
  },
  drawerCloseIcon: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 30,
  },
  profileContainer: {
    backgroundColor: '#00000040',
    padding: scale(10),
  },
  profile: {
    marginLeft: 10,
    flex: 1,
  },
  userImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(50),
  },
  menuItem: {
    paddingVertical: scale(10),
    flexDirection: 'row',
    paddingLeft: scale(22),
  },
  menuItemText: {
    marginLeft: scale(10),
    textTransform: 'uppercase',
    color: 'white',
    fontFamily: Fonts.OpenSans_SemiBold,
  },
  menuIcon: {
    height: scale(22),
    width: scale(22),
    resizeMode: 'contain',
    tintColor: 'white',
  },
  closeIconContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});