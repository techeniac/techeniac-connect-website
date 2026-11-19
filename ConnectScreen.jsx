import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';

const COLORS = {
  blue: '#425EF9',
  blueDark: '#2445F0',
  blueBadge: '#EDF2FF',
  white: '#FFFFFF',
  textDark: '#000921',
  textLabel: '#7C8BA6',
  textMuted: '#536280',
  bgBase: '#F4F7FD',
  cardBg: '#FFFFFF',
  cardBorder: 'rgba(66, 94, 249, 0.08)',
};

const ArrowUpRight = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={COLORS.blue} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={7} y1={17} x2={17} y2={7} />
    <Polyline points="7,7 17,7 17,17" />
  </Svg>
);

export default function ConnectScreen() {
  const openUrl = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        
        {/* Main Content Area */}
        <View style={styles.contentWrap}>
          
          {/* Header: Centered TechEniac Logo in Electric Blue */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => openUrl('https://techeniac.com/')}
              activeOpacity={0.8}
              style={styles.logoTouch}
            >
              <Svg width={30} height={30} viewBox="0 0 76 60" fill="none">
                <Path
                  d="M39.9017 59.9812C37.5378 59.9436 35.1929 59.4736 33.0182 58.5901C30.8434 57.7065 28.8767 56.4282 27.2315 54.8302C25.5862 53.2323 24.2814 51.3336 23.4115 49.2657C22.5416 47.1978 22.1067 44.9795 22.1634 42.7424C21.2368 42.1972 20.3669 41.5769 19.5348 40.9377C6.10817 30.4854 7.73449 19.4127 8.60439 13.4722C8.83132 12.4382 8.90696 11.3667 8.85023 10.3139C8.24508 8.998 4.23601 8.13324 1.059 7.90765C0.718608 7.90765 0.359304 7.88885 0 7.85125L0.189107 4.91859C0.416036 4.91859 0.77534 4.93739 1.2292 4.97499C4.65204 5.03139 6.92133 3.77184 9.36082 2.45591C12.0461 0.951977 14.8449 -0.551952 18.7784 0.200012C24.8676 1.36556 26.7398 8.07684 27.2882 11.3667C30.6732 10.6147 38.0673 9.61837 44.3268 13.3782C53.4228 8.07684 63.2375 4.01623 73.525 1.29036L76.0968 0.575995L75.4917 3.03868C75.3593 3.56505 72.7496 13.6414 61.8192 23.2477L70.9342 19.9015L69.4402 23.1349C69.1377 23.7741 62.084 38.6442 48.2602 40.0353L47.9198 37.1215C56.146 36.2943 61.8003 29.6018 64.5802 25.3908L52.7231 29.7522L51.3237 27.1579C60.4198 21.9882 67.5113 14.2054 71.5582 4.97499C39.4289 14.5813 26.6263 29.7522 25.3782 41.1069C41.2254 49.0025 63.5212 37.9486 63.767 37.8358L68.0598 35.6739L65.9039 39.791C65.7716 40.0353 55.087 60 39.9017 60V59.9812ZM25.3404 44.3779C25.5295 46.7654 26.3805 49.0401 27.8177 51.014C29.2549 52.9879 31.2216 54.5483 33.5098 55.5822C45.7451 61.2031 56.1082 49.0589 60.6468 42.4228C53.1581 45.3555 37.9349 49.8485 25.3404 44.3779ZM8.20726 6.34732C9.70121 6.8173 10.9493 7.83245 11.6868 9.12959C12.1974 10.2387 11.9705 11.7615 11.6868 13.8482C10.8359 19.6007 9.41755 29.2634 21.5015 38.663C21.823 38.9074 22.1445 39.1518 22.466 39.3774C23.8275 31.8765 29.5953 23.0973 41.4523 15.2017C34.6445 11.9683 26.5696 14.6001 26.475 14.6189L24.5083 15.2769L24.3949 13.3218C24.3949 13.3218 23.7519 4.11023 18.1543 3.05748C15.3744 2.5311 13.4077 3.60265 10.9115 4.95619C10.0605 5.40737 9.17171 5.89614 8.20726 6.32852V6.34732Z"
                  fill="#425EF9"
                />
              </Svg>
              <Text style={styles.brandName}>TechEniac</Text>
            </TouchableOpacity>
          </View>

          {/* Tagline: Vertically Stacked "Think Build Grow" */}
          <View style={styles.taglineCol}>
            <Text style={[styles.taglineWord, styles.wordDark]}>Think</Text>
            <Text style={[styles.taglineWord, styles.wordBlue]}>Build</Text>
            <Text style={[styles.taglineWord, styles.wordDark]}>Grow</Text>
          </View>

          {/* Cards Layout Group: Hero Full-Width Card + 2-Column Pairs */}
          <View style={styles.cardsLayoutGroup}>
            
            {/* Card 1: Our Website (Full Width) */}
            <TouchableOpacity
              style={styles.cardFull}
              onPress={() => openUrl('https://techeniac.com/')}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconCircle}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#425EF9" strokeWidth={2}>
                    <Circle cx={12} cy={12} r={10} />
                    <Line x1={2} y1={12} x2={22} y2={12} />
                    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </Svg>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.microLabel}>OUR WEBSITE</Text>
                  <Text style={styles.cardTitle}>techeniac.com</Text>
                </View>
              </View>
              <View style={styles.actionArrow}>
                <ArrowUpRight />
              </View>
            </TouchableOpacity>

            {/* Row 2: LinkedIn & Instagram (2 Columns) */}
            <View style={styles.cardsGridRow}>
              
              {/* LinkedIn */}
              <TouchableOpacity
                style={styles.cardGridItem}
                onPress={() => openUrl('https://www.linkedin.com/company/techeniac-services-llp/')}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconCircle}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#425EF9">
                      <Path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.55a1.63 1.63 0 1 0 0 3.25 1.63 1.63 0 0 0 0-3.25z" />
                    </Svg>
                  </View>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.microLabel}>LINKEDIN</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>Connect with us</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <ArrowUpRight />
                </View>
              </TouchableOpacity>

              {/* Instagram */}
              <TouchableOpacity
                style={styles.cardGridItem}
                onPress={() => openUrl('https://www.instagram.com/life_at_techeniac')}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconCircle}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#425EF9" strokeWidth={2}>
                      <Rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                      <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <Line x1={17.5} y1={6.5} x2={17.51} y2={6.5} />
                    </Svg>
                  </View>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.microLabel}>INSTAGRAM</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>Follow us</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <ArrowUpRight />
                </View>
              </TouchableOpacity>

            </View>

            {/* Row 3: Sales & HR (2 Columns) */}
            <View style={styles.cardsGridRow}>
              
              {/* Sales */}
              <TouchableOpacity
                style={styles.cardGridItem}
                onPress={() => openUrl('tel:+918140085842')}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconCircle}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#425EF9">
                      <Path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.57 3.9a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1C3 13.04 10.96 21 21.01 21a1 1 0 0 0 1-1v-3.62a1 1 0 0 0-1-1z" />
                    </Svg>
                  </View>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.microLabel}>SALES</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>+91 81400 85842</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <ArrowUpRight />
                </View>
              </TouchableOpacity>

              {/* HR */}
              <TouchableOpacity
                style={styles.cardGridItem}
                onPress={() => openUrl('tel:+918401284730')}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconCircle}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#425EF9">
                      <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </Svg>
                  </View>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.microLabel}>HR</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>+91 84012 84730</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <ArrowUpRight />
                </View>
              </TouchableOpacity>

            </View>

            {/* Row 4: WhatsApp & Email (2 Columns) */}
            <View style={styles.cardsGridRow}>
              
              {/* WhatsApp with Phone Number */}
              <TouchableOpacity
                style={styles.cardGridItem}
                onPress={() => openUrl('https://api.whatsapp.com/send?phone=+918140085842&text=Hello')}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconCircle}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#425EF9">
                      <Path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </Svg>
                  </View>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.microLabel}>WHATSAPP</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>+91 81400 85842</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <ArrowUpRight />
                </View>
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity
                style={styles.cardGridItem}
                onPress={() => openUrl('mailto:buzz@techeniac.com')}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconCircle}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#425EF9" strokeWidth={2}>
                      <Rect x={2} y={4} width={20} height={16} rx={2} />
                      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </Svg>
                  </View>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.microLabel}>EMAIL</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>buzz@techeniac.com</Text>
                  </View>
                </View>
                <View style={styles.actionArrow}>
                  <ArrowUpRight />
                </View>
              </TouchableOpacity>

            </View>

          </View>

        </View>

        {/* Wavy Footer with Location & Address */}
        <View style={styles.footerWrap}>
          <TouchableOpacity
            style={styles.addressTouch}
            onPress={() => openUrl('https://maps.google.com/?q=1501+Westport,+near+Taj+Hotel,+Sindhubhavan+Road,+Ahmedabad,+Gujarat+380059')}
            activeOpacity={0.8}
          >
            <View style={styles.pinWrap}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
                <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </Svg>
            </View>
            <View style={styles.addressLines}>
              <Text style={styles.addressText}>1501 Westport, near Taj Hotel, Sindhubhavan Road,</Text>
              <Text style={styles.addressText}>Ahmedabad, Gujarat 380059.</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBase,
    justifyContent: 'space-between',
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  logoTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    color: COLORS.blue,
    fontSize: 22,
    fontWeight: '700',
  },
  taglineCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
    gap: 2,
  },
  taglineWord: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  wordDark: {
    color: COLORS.textDark,
  },
  wordBlue: {
    color: COLORS.blue,
  },
  cardsLayoutGroup: {
    gap: 10,
    width: '100%',
  },
  cardsGridRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cardFull: {
    width: '100%',
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardGridItem: {
    flex: 1,
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 12,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    overflow: 'hidden',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.blueBadge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
    overflow: 'hidden',
  },
  microLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textLabel,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 1,
  },
  actionArrow: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  footerWrap: {
    backgroundColor: COLORS.blueDark,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  addressTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pinWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLines: {
    flexDirection: 'column',
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
  },
});
