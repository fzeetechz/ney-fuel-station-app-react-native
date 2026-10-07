import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import CallIcon from '../assets/Svg/CallIcon.svg';
import HomeIcon from '../assets/Svg/HomeIcon.svg';
import SendMessageIcon from '../assets/Svg/SendMessageIcon.svg';
import SupportIcon from '../assets/Svg/SupportIcon.svg';
import {theme} from '../constants/colors';
import {RootStackParamList} from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TrackOrder'>;

const trackingSteps = [
  {label: 'Order Confirmed', time: '09:15 AM', complete: true},
  {label: 'Driver Assigned', time: '09:20 AM', complete: true},
  {label: 'On the way', time: '09:45 AM', complete: true},
  {label: 'Delivery', time: 'Pending', complete: false},
];

export default function TrackOrderScreen({navigation}: Props) {
  const [chatVisible, setChatVisible] = useState(false);
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.backButton}>
          <BackArrowIcon width={21} height={14} color={theme.colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.map}>
        <View style={[styles.road, styles.roadOne]} />
        <View style={[styles.road, styles.roadTwo]} />
        <View style={[styles.road, styles.roadThree]} />
        <View style={[styles.road, styles.roadFour]} />
        <View style={styles.water} />
        <View style={[styles.route, styles.routeOne]} />
        <View style={[styles.route, styles.routeTwo]} />
        <View style={[styles.route, styles.routeThree]} />
        <View style={[styles.route, styles.routeFour]} />
        <View style={styles.vehicleMarker}>
          <Image
            source={require('../assets/Images/welcomeTopimage.png')}
            style={styles.vehicleImage}
          />
        </View>
        <View style={styles.homeMarker}>
          <HomeIcon width={24} height={24} color={theme.colors.white} />
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.orderRow}>
          <Text style={styles.orderId}>Order #ORD12345</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>On the Way</Text>
          </View>
        </View>
        <Text style={styles.estimateLabel}>Estimate Arrival</Text>
        <Text style={styles.estimate}>10:25 AM - 10:35 PM</Text>

        <View style={styles.timeline}>
          {trackingSteps.map((step, index) => (
            <View key={step.label} style={styles.timelineRow}>
              {index < trackingSteps.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    !trackingSteps[index + 1].complete && styles.pendingLine,
                  ]}
                />
              )}
              <View style={[styles.stepDot, !step.complete && styles.pendingDot]}>
                <Text style={styles.stepCheck}>✓</Text>
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <Text style={styles.stepTime}>{step.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverRow}>
            <Image
              source={require('../assets/Images/banner-image1.png')}
              style={styles.driverImage}
            />
            <View>
              <Text style={styles.driverName}>Muhammad Ali</Text>
              <Text style={styles.driverRole}>Driver</Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <Pressable
              accessibilityRole="button"
              style={({pressed}) => [styles.contactButton, pressed && styles.pressed]}>
              <CallIcon width={15} height={15} />
              <Text style={styles.callText}>Call</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setChatVisible(true)}
              style={({pressed}) => [
                styles.contactButton,
                styles.messageButton,
                pressed && styles.pressed,
              ]}>
              <SupportIcon width={16} height={16} color={theme.colors.white} />
              <Text style={styles.messageText}>Message</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.footer}>@NeyFuel2026</Text>
      </View>
      <DriverChat visible={chatVisible} onClose={() => setChatVisible(false)} />
    </SafeAreaView>
  );
}

type ChatMessage = {id: string; text: string; sent: boolean; time: string};

function DriverChat({visible, onClose}: {visible: boolean; onClose: () => void}) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(current => [
      ...current,
      {id: String(Date.now()), text, sent: true, time: 'Now'},
    ]);
    setDraft('');
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.modalRoot}>
        <Pressable accessibilityLabel="Close chat" onPress={onClose} style={styles.backdrop} />
        <View style={styles.chatSheet}>
          <SafeAreaView edges={['top', 'bottom']} style={styles.chatSafeArea}>
            <View style={styles.chatHeader}>
              <Pressable
                accessibilityLabel="Close chat"
                accessibilityRole="button"
                hitSlop={12}
                onPress={onClose}
                style={styles.chatBack}>
                <BackArrowIcon width={21} height={14} color={theme.colors.navy} />
              </Pressable>
              <Text style={styles.chatTitle}>Chat</Text>
            </View>

            <View style={styles.chatDriverCard}>
              <Image
                source={require('../assets/Images/banner-image1.png')}
                style={styles.chatDriverImage}
              />
              <View>
                <Text style={styles.chatDriverName}>Muhammad Ali</Text>
                <Text style={styles.chatDriverRole}>Driver</Text>
                <Text style={styles.chatOrder}>
                  Order <Text style={styles.chatOrderNumber}>#ORD12345</Text>
                </Text>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.messages}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              showsVerticalScrollIndicator={false}>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  {index === 2 && (
                    <View style={styles.dayRow}>
                      <View style={styles.dayLine} />
                      <Text style={styles.dayText}>Today</Text>
                      <View style={styles.dayLine} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.messageBlock,
                      message.sent ? styles.sentBlock : styles.receivedBlock,
                    ]}>
                    <View
                      style={[
                        styles.bubble,
                        message.sent ? styles.sentBubble : styles.receivedBubble,
                      ]}>
                      <Text
                        style={[
                          styles.bubbleText,
                          message.sent && styles.sentBubbleText,
                        ]}>
                        {message.text}
                      </Text>
                    </View>
                    <Text style={styles.messageTime}>
                      {message.time} {message.sent ? '✓✓' : ''}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                accessibilityLabel="Message"
                onChangeText={setDraft}
                onSubmitEditing={sendMessage}
                placeholder="Send Message"
                placeholderTextColor="#A7A7A7"
                returnKeyType="send"
                style={styles.composerInput}
                value={draft}
              />
              <Pressable
                accessibilityLabel="Send message"
                accessibilityRole="button"
                hitSlop={8}
                onPress={sendMessage}
                style={styles.sendButton}>
                <SendMessageIcon width={25} height={24} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: theme.colors.background, flex: 1},
  header: {alignItems: 'center', height: 48, justifyContent: 'center'},
  backButton: {left: 15, position: 'absolute'},
  headerTitle: {color: theme.colors.navy, fontFamily: theme.typography.heading, fontSize: 18},
  map: {backgroundColor: theme.colors.mapBackground, height: 220, overflow: 'hidden'},
  road: {backgroundColor: theme.colors.mapRoad, height: 7, opacity: 0.85, position: 'absolute', width: 380},
  roadOne: {left: -45, top: 42, transform: [{rotate: '18deg'}]},
  roadTwo: {left: -38, top: 127, transform: [{rotate: '-21deg'}]},
  roadThree: {left: 92, top: 104, transform: [{rotate: '73deg'}]},
  roadFour: {left: 125, top: 180, transform: [{rotate: '-8deg'}]},
  water: {backgroundColor: '#CBE7EF', height: 210, opacity: 0.7, position: 'absolute', right: 48, top: 88, transform: [{rotate: '25deg'}], width: 66},
  route: {backgroundColor: theme.colors.success, borderRadius: 3, height: 5, position: 'absolute'},
  routeOne: {left: 39, top: 73, transform: [{rotate: '82deg'}], width: 54},
  routeTwo: {left: 52, top: 112, transform: [{rotate: '-15deg'}], width: 82},
  routeThree: {left: 119, top: 143, transform: [{rotate: '51deg'}], width: 67},
  routeFour: {left: 168, top: 169, transform: [{rotate: '8deg'}], width: 111},
  vehicleMarker: {backgroundColor: theme.colors.white, borderRadius: 24, elevation: 3, height: 46, left: 19, overflow: 'hidden', padding: 4, position: 'absolute', shadowColor: theme.colors.text, shadowOpacity: 0.2, shadowRadius: 3, top: 35, width: 46},
  vehicleImage: {borderRadius: 20, height: '100%', resizeMode: 'cover', width: '100%'},
  homeMarker: {alignItems: 'center', backgroundColor: theme.colors.primary, borderColor: theme.colors.white, borderRadius: 23, borderWidth: 3, bottom: 17, height: 44, justifyContent: 'center', position: 'absolute', right: 18, width: 44},
  sheet: {backgroundColor: theme.colors.white, borderTopLeftRadius: 17, borderTopRightRadius: 17, flex: 1, marginTop: -16, paddingHorizontal: 15, paddingTop: 30},
  orderRow: {alignItems: 'center', flexDirection: 'row'},
  orderId: {color: theme.colors.navy, flex: 1, fontFamily: theme.typography.heading, fontSize: 16},
  statusPill: {backgroundColor: theme.colors.successBackground, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 4},
  statusText: {color: theme.colors.success, fontFamily: theme.typography.body, fontSize: 8},
  estimateLabel: {color: theme.colors.muted, fontFamily: theme.typography.body, fontSize: 9, marginTop: 17},
  estimate: {color: theme.colors.navy, fontFamily: theme.typography.heading, fontSize: 17, marginTop: 7},
  timeline: {borderTopColor: theme.colors.border, borderTopWidth: 1, marginTop: 11, paddingTop: 3},
  timelineRow: {alignItems: 'center', flexDirection: 'row', height: 32},
  timelineLine: {backgroundColor: theme.colors.success, height: 19, left: 7, position: 'absolute', top: 23, width: 2},
  pendingLine: {backgroundColor: theme.colors.timelinePending},
  stepDot: {alignItems: 'center', backgroundColor: theme.colors.success, borderRadius: 8, height: 16, justifyContent: 'center', width: 16},
  pendingDot: {backgroundColor: theme.colors.timelinePending},
  stepCheck: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 9},
  stepLabel: {color: theme.colors.text, fontFamily: theme.typography.body, fontSize: 9, marginLeft: 14},
  stepTime: {color: theme.colors.text, fontFamily: theme.typography.body, fontSize: 9, marginLeft: 'auto'},
  driverCard: {backgroundColor: theme.colors.navyDark, borderRadius: 7, marginTop: 'auto', padding: 12},
  driverRow: {alignItems: 'center', flexDirection: 'row'},
  driverImage: {borderColor: theme.colors.white, borderRadius: 20, borderWidth: 1, height: 40, marginRight: 10, resizeMode: 'cover', width: 40},
  driverName: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 13},
  driverRole: {color: theme.colors.white, fontFamily: theme.typography.body, fontSize: 9, marginTop: 4},
  contactRow: {flexDirection: 'row', gap: 16, marginTop: 13},
  contactButton: {alignItems: 'center', borderColor: theme.colors.primary, borderRadius: 8, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 9, height: 29, justifyContent: 'center'},
  messageButton: {backgroundColor: theme.colors.primary},
  callText: {color: theme.colors.primary, fontFamily: theme.typography.bodyBold, fontSize: 12},
  messageText: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 12},
  footer: {color: theme.colors.muted, fontFamily: theme.typography.body, fontSize: 8, paddingBottom: 1, paddingTop: 8, textAlign: 'center'},
  pressed: {opacity: 0.72},
  modalRoot: {flex: 1, justifyContent: 'flex-end'},
  backdrop: {
    backgroundColor: theme.colors.modalBackdrop,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  chatSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flex: 1,
    marginTop: '4%',
    overflow: 'hidden',
  },
  chatSafeArea: {backgroundColor: theme.colors.background, flex: 1},
  chatHeader: {alignItems: 'center', height: 43, justifyContent: 'center'},
  chatBack: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
    width: 50,
    zIndex: 1,
  },
  chatTitle: {color: theme.colors.navy, fontFamily: theme.typography.heading, fontSize: 17},
  chatDriverCard: {alignItems: 'center', backgroundColor: theme.colors.navyDark, borderRadius: 7, flexDirection: 'row', marginHorizontal: 16, marginTop: 4, minHeight: 88, paddingHorizontal: 12},
  chatDriverImage: {borderColor: theme.colors.white, borderRadius: 21, borderWidth: 1, height: 42, marginRight: 10, resizeMode: 'cover', width: 42},
  chatDriverName: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 13},
  chatDriverRole: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 12, marginTop: 4},
  chatOrder: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 12, marginTop: 5},
  chatOrderNumber: {color: theme.colors.primary},
  messages: {flexGrow: 1, paddingBottom: 12, paddingHorizontal: 18, paddingTop: 24},
  messageBlock: {marginBottom: 12, maxWidth: '72%'},
  sentBlock: {alignItems: 'flex-end', alignSelf: 'flex-end'},
  receivedBlock: {alignItems: 'flex-start', alignSelf: 'flex-start'},
  bubble: {borderRadius: 14, paddingHorizontal: 13, paddingVertical: 10},
  receivedBubble: {backgroundColor: theme.colors.chatIncoming, borderBottomLeftRadius: 0},
  sentBubble: {backgroundColor: theme.colors.navyDark, borderBottomRightRadius: 0},
  bubbleText: {color: theme.colors.text, fontFamily: theme.typography.body, fontSize: 11, lineHeight: 14},
  sentBubbleText: {color: theme.colors.white},
  messageTime: {color: '#8B8B8B', fontFamily: theme.typography.body, fontSize: 8, marginTop: 4},
  dayRow: {alignItems: 'center', flexDirection: 'row', marginBottom: 18, marginTop: 2, width: '100%'},
  dayLine: {backgroundColor: theme.colors.border, flex: 1, height: 1},
  dayText: {color: theme.colors.muted, fontFamily: theme.typography.body, fontSize: 9, marginHorizontal: 8},
  composer: {alignItems: 'center', borderColor: theme.colors.navy, borderRadius: 22, borderWidth: 1, flexDirection: 'row', height: 41, marginBottom: 3, marginHorizontal: 18, paddingLeft: 16, paddingRight: 5},
  composerInput: {color: theme.colors.text, flex: 1, fontFamily: theme.typography.body, fontSize: 11, height: 39, paddingVertical: 0},
  sendButton: {alignItems: 'center', height: 32, justifyContent: 'center', width: 38},
});
