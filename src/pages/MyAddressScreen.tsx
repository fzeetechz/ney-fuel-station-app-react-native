import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Circle, Path} from 'react-native-svg';
import Toast from 'react-native-toast-message';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import CallIcon from '../assets/Svg/CallIcon.svg';
import {colors} from '../constants/colors';
import {RootStackParamList} from '../routes/types';
import {Address, deleteAddress, getAddresses} from '../services/addressServices';
import {getApiErrorMessage} from '../services/auth';
import {fontFamilies} from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'MyAddress'>;

const SearchIcon = () => <Svg width={15} height={15} viewBox="0 0 15 15" fill="none"><Circle cx="6.4" cy="6.4" r="4.6" stroke="#FFF" strokeWidth="1" /><Path d="m9.8 9.8 3.1 3.1" stroke="#FFF" strokeWidth="1" strokeLinecap="round" /></Svg>;
const HomeIcon = () => <Svg width={19} height={19} viewBox="0 0 17 17" fill="none"><Path d="m2.2 7.8 6.3-5.7 6.3 5.7M3.8 6.6v7.7h3.4v-4h2.6v4h3.4V6.6" stroke="#28777A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
const EditIcon = () => <Svg width={15} height={15} viewBox="0 0 13 13" fill="none"><Path d="m2.2 9.8-.4 1.6 1.7-.4 6.8-6.8-1.3-1.3-6.8 6.9ZM8.3 3.6l1.3 1.3" stroke="#28777A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
const DeleteIcon = () => <Svg width={15} height={15} viewBox="0 0 13 13" fill="none"><Path d="M3.5 4.3v6.2h6V4.3M2.7 3h7.6M5 3V1.8h3V3M5.2 5.6v3.2M7.8 5.6v3.2" stroke={colors.primary} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></Svg>;

export default function MyAddressScreen({navigation}: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string>();

  const loadAddresses = useCallback(async (refresh = false) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      const response = await getAddresses();
      setAddresses(response.data ?? []);
    } catch (error) {
      Toast.show({type: 'error', text1: getApiErrorMessage(error)});
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  useFocusEffect(useCallback(() => { loadAddresses(); }, [loadAddresses]));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? addresses.filter(address =>
      [address.label, address.recipient, address.line1, address.city, address.postalCode, address.phone]
        .some(value => value?.toLowerCase().includes(query))) : addresses;
  }, [addresses, search]);

  const confirmDelete = (address: Address) => Alert.alert(
    'Delete address?',
    `Remove ${address.label} from your saved addresses?`,
    [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: async () => {
      try {
        setDeletingId(address._id);
        const response = await deleteAddress(address._id);
        setAddresses(current => current.filter(item => item._id !== address._id));
        Toast.show({type: 'success', text1: response.message || 'Address deleted.'});
      } catch (error) {
        Toast.show({type: 'error', text1: getApiErrorMessage(error)});
      } finally { setDeletingId(undefined); }
    }}],
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={navigation.goBack} style={styles.backButton}><BackArrowIcon width={24} height={15} color={colors.white} /></Pressable>
          <Text style={styles.headerTitle}>My Address</Text>
        </View>
        <View style={styles.searchBox}><SearchIcon /><TextInput onChangeText={setSearch} placeholder="Search saved addresses" placeholderTextColor="#E4E8F1" style={styles.searchInput} value={search} /></View>
      </View>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl colors={[colors.primary]} onRefresh={() => loadAddresses(true)} refreshing={isRefreshing} tintColor={colors.primary} />} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.navigate('AddAddress')} style={({pressed}) => [styles.addCard, pressed && styles.pressed]}>
          <View style={styles.addIcon}><Text style={styles.plus}>＋</Text></View>
          <View><Text style={styles.addTitle}>Add a new address</Text><Text style={styles.addSubtitle}>Select location and delivery details</Text></View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        {isLoading ? <View style={styles.state}><ActivityIndicator color={colors.primary} /><Text style={styles.stateText}>Loading addresses…</Text></View>
          : filtered.length === 0 ? <View style={styles.emptyState}><View style={styles.emptyIcon}><HomeIcon /></View><Text style={styles.emptyTitle}>{search ? 'No matching address' : 'No saved addresses yet'}</Text><Text style={styles.emptyText}>{search ? 'Try another search.' : 'Add an address to make delivery faster.'}</Text></View>
          : filtered.map(address => (
            <View key={address._id} style={styles.addressCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}><HomeIcon /></View>
                <View style={styles.headerCopy}><Text style={styles.addressTitle}>{address.label}</Text><Text style={styles.recipient}>{address.recipient}</Text></View>
                <View style={styles.cardActions}>
                  <Pressable accessibilityLabel={`Edit ${address.label} address`} onPress={() => navigation.navigate('AddAddress', {address})} style={[styles.iconButton, styles.editButton]}><EditIcon /></Pressable>
                  <Pressable accessibilityLabel={`Delete ${address.label} address`} disabled={deletingId === address._id} onPress={() => confirmDelete(address)} style={[styles.iconButton, styles.deleteButton]}>{deletingId === address._id ? <ActivityIndicator color={colors.primary} size="small" /> : <DeleteIcon />}</Pressable>
                </View>
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressText}>{address.line1}</Text>
                <Text style={styles.addressText}>{[address.city, address.postalCode, address.country].filter(Boolean).join(', ')}</Text>
                <View style={styles.phoneRow}><CallIcon width={13} height={13} /><Text style={styles.phoneText}>{address.phone}</Text></View>
              </View>
            </View>
          ))}
        <Text style={styles.footer}>@NeyFuel{new Date().getFullYear()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.navyDark, flex: 1}, topSection: {backgroundColor: colors.navy, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingBottom: 20}, header: {alignItems: 'center', height: 49, justifyContent: 'center'}, backButton: {left: 16, position: 'absolute'}, headerTitle: {color: colors.white, fontFamily: fontFamilies.heading, fontSize: 17},
  searchBox: {alignItems: 'center', borderColor: colors.headerBorder, borderRadius: 8, borderWidth: 1, flexDirection: 'row', height: 39, marginHorizontal: 16, paddingHorizontal: 12}, searchInput: {color: colors.white, flex: 1, fontFamily: fontFamilies.body, fontSize: 12, marginLeft: 10, padding: 0},
  content: {backgroundColor: '#F6F7F9', flexGrow: 1, padding: 16}, addCard: {alignItems: 'center', backgroundColor: colors.white, borderColor: '#E5E7EB', borderRadius: 12, borderWidth: 1, elevation: 2, flexDirection: 'row', marginBottom: 14, padding: 13, shadowColor: '#0C1B3A', shadowOffset: {height: 2, width: 0}, shadowOpacity: 0.08, shadowRadius: 6}, addIcon: {alignItems: 'center', backgroundColor: '#FCE9DF', borderRadius: 20, height: 40, justifyContent: 'center', marginRight: 11, width: 40}, plus: {color: colors.primary, fontFamily: fontFamilies.body, fontSize: 22}, addTitle: {color: colors.navy, fontFamily: fontFamilies.bodyBold, fontSize: 13}, addSubtitle: {color: colors.muted, fontFamily: fontFamilies.body, fontSize: 10, marginTop: 3}, chevron: {color: colors.primary, fontSize: 25, marginLeft: 'auto'}, pressed: {opacity: 0.72},
  addressCard: {backgroundColor: colors.white, borderColor: '#E5E7EB', borderRadius: 12, borderWidth: 1, elevation: 2, marginBottom: 11, padding: 13, shadowColor: '#0C1B3A', shadowOffset: {height: 2, width: 0}, shadowOpacity: 0.07, shadowRadius: 5}, cardHeader: {alignItems: 'center', flexDirection: 'row'}, iconCircle: {alignItems: 'center', backgroundColor: '#E9F3F2', borderRadius: 20, height: 40, justifyContent: 'center', width: 40}, headerCopy: {flex: 1, marginLeft: 10}, addressTitle: {color: '#226D70', fontFamily: fontFamilies.bodyBold, fontSize: 13}, recipient: {color: colors.text, fontFamily: fontFamilies.bodyBold, fontSize: 11, marginTop: 2}, cardActions: {flexDirection: 'row'}, iconButton: {alignItems: 'center', borderRadius: 16, height: 32, justifyContent: 'center', marginLeft: 7, width: 32}, editButton: {backgroundColor: '#E2EEEE'}, deleteButton: {backgroundColor: '#FCE7DA'}, addressDetails: {borderTopColor: '#EFEFF2', borderTopWidth: 1, marginLeft: 50, marginTop: 10, paddingTop: 9}, addressText: {color: '#535760', fontFamily: fontFamilies.body, fontSize: 11, lineHeight: 17}, phoneRow: {alignItems: 'center', flexDirection: 'row', marginTop: 7}, phoneText: {color: '#535760', fontFamily: fontFamilies.body, fontSize: 11, marginLeft: 7},
  state: {alignItems: 'center', justifyContent: 'center', paddingVertical: 65}, stateText: {color: colors.muted, fontFamily: fontFamilies.body, fontSize: 12, marginTop: 10}, emptyState: {alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: 38}, emptyIcon: {alignItems: 'center', backgroundColor: '#E9F3F2', borderRadius: 24, height: 48, justifyContent: 'center', width: 48}, emptyTitle: {color: colors.navy, fontFamily: fontFamilies.bodyBold, fontSize: 14, marginTop: 13}, emptyText: {color: colors.muted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 5}, footer: {color: colors.muted, fontFamily: fontFamilies.body, fontSize: 9, marginTop: 'auto', paddingTop: 22, textAlign: 'center'},
});
