/**
 * This is the component for showing all the details to the user based on selection in quotation module
 *
 * @module components/QuotationPortalDetails
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, Text, SafeAreaView, ScrollView, Dimensions, Pressable } from 'react-native';
import { useParams } from 'react-router-dom';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { Image } from 'components/sales';
import { ICONS, ROUTE } from 'const';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import useNavigate from 'hooks/useNavigate';

import { Sizing } from 'styles';
import { refactorResponse } from 'utils/responseHelper';
import styles from './QuotationPortalDetails.styles';
/**
 * Represents a QuotationPortalDetails component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const QuotationPortalDetails = () => {
  const { code } = useParams();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const GET_OFFER_DETAILS = gql`
    query GetOfferPackDetails($offerName: String!, $packPrice: String!) {
      getOfferPackDetails(offerName: $offerName, packPrice: $packPrice) {
        packageId
        bouquetType
        packName
        packFriendlyName
        hdCount
        sdCount
        genre
        packPrice
        bouquetChannels {
          id
          packName
          packItems {
            id
            title
            subChannels {
              pid
              pName
              channelName
              bid
              pmrp
              hdFlag
              epgNumber
              hdOrSd
              sdOrId
              rentalFlag
              cName
              recoGenreId
              channelId
              language
              genreName
              bcat
              packageCat
              imageName
              imageURL
            }
          }
        }
      }
    }
  `;

  const [getOfferDetails, { loading: loadingDetail, data: dataDetail, error: errorDetail }] = useLazyQuery(GET_OFFER_DETAILS, {
    fetchPolicy: 'network-only',
  });
  if (loadingDetail) {
    dispatch(uiActions.setLoader());
  }
  if (errorDetail) {
    dispatch(uiActions.clearLoader());
    dispatch(uiActions.showErrorPage(errorDetail.message));
  }

  if (dataDetail) {
    dispatch(uiActions.clearLoader());
    const data = refactorResponse(dataDetail);
    dispatch(formActions.setNavigationData(data, '', '', ''));
    navigate(ROUTE.WEB.PACK_VIEW_DETAILS);
  }

  const handleViewDetails = (item: any) => {
    getOfferDetails({
      variables: {
        offerName: item.pack,
        packPrice: String(item.price),
      },
    });
  };

  const GET_QUOTATION_DETAILS = gql`
    query GetQuotationDetails($getQuotationDetailsId: String) {
      getQuotationDetails(id: $getQuotationDetailsId) {
        result {
          totalPrice
          primary {
            NCF
            boxPrice
            boxType
            pack {
              pack
              price
            }
          }
          secondaryBox1 {
            NCF
            boxPrice
            boxType
            pack {
              pack
              price
            }
          }
          secondaryBox2 {
            NCF
            boxPrice
            boxType
            pack {
              pack
              price
            }
          }
          secondaryBox3 {
            NCF
            boxPrice
            boxType
            pack {
              pack
              price
            }
          }
        }
        message
        status
      }
    }
  `;

  const { loading, data, error } = useQuery(GET_QUOTATION_DETAILS, {
    variables: { getQuotationDetailsId: code },
    fetchPolicy: 'network-only', // Always fetch fresh data
  });
  if (loading) {
    dispatch(uiActions.setLoader());
    return (
      <View style={styles.containerCenter}>
        <Image iconName={ICONS.LOGO_BLACK} style={styles.imageLarge} />
        <Text style={styles.errorText}>Loading....</Text>
      </View>
    );
  }
  if (error || !data?.getQuotationDetails?.status) {
    dispatch(uiActions.clearLoader());
    return (
      <View style={styles.containerCenter}>
        <Image iconName={ICONS.LOGO_BLACK} style={styles.imageLarge} />
        <Text style={styles.errorText}>{error?.message ?? data?.getQuotationDetails?.message}</Text>
      </View>
    );
  }
  dispatch(uiActions.clearLoader());

  const { primary, secondaryBox1, secondaryBox2, secondaryBox3, totalPrice } = data?.getQuotationDetails?.result || {};

  return (
    <SafeAreaView style={styles.container} testID="QuotationPortalDetails">
      <ScrollView style={{ height: Dimensions.get('window').height }} showsVerticalScrollIndicator>
        <View style={styles.imageContainer}>
          <Image iconName={ICONS.LOGO_BLACK} style={styles.image} />
        </View>
        <View style={styles.outerContainer}>
          <Text style={styles.titleText}>Your Order Summary</Text>

          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Grand Total</Text>
              <Text style={styles.headerPrice}>₹{totalPrice}</Text>
            </View>
            {primary?.boxType && (
              <View>
                <View style={styles.subHeader}>
                  <Text style={styles.subHeaderText}>Primary Box-{primary?.boxType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Primary connection</Text>
                  <Text style={styles.rowValue}>₹{primary?.boxPrice}</Text>
                </View>

                {primary?.pack.map((item: any) => (
                  <View key={item.pack} style={styles.row}>
                    <View style={styles.leftRow}>
                      <Text style={styles.rowLabel}>{item?.pack}</Text>
                      <Pressable onPress={() => handleViewDetails(item)} testID={`view-details-${item.pack}`}>
                        <Image iconName={ICONS.DETAILS_INFO} height={Sizing.layout.x18} width={Sizing.layout.x18} isDimension={false} style={styles.infoIcon} />
                      </Pressable>
                    </View>
                    <Text style={styles.rowValue}>₹{item?.price}</Text>
                  </View>
                ))}

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>NCF</Text>
                  <Text style={styles.rowValue}>₹{primary?.NCF}</Text>
                </View>
              </View>
            )}

            {/* Secondary Box 1 */}
            {secondaryBox1?.boxType && (
              <View>
                <View style={styles.subHeader}>
                  <Text style={styles.subHeaderText}>
                    Secondary Box{primary?.boxType && `1`}-{secondaryBox1?.boxType}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Secondary connection</Text>
                  <Text style={styles.rowValue}>₹{secondaryBox1?.boxPrice}</Text>
                </View>

                {secondaryBox1?.pack.map((item: any) => (
                  <View key={item.pack} style={styles.row}>
                    <Text style={styles.rowLabel}>{item?.pack}</Text>
                    <Text style={styles.rowValue}>₹{item?.price}</Text>
                  </View>
                ))}

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>NCF</Text>
                  <Text style={styles.rowValue}>₹{secondaryBox1?.NCF}</Text>
                </View>
              </View>
            )}

            {/* Secondary Box 2 */}
            {secondaryBox2?.boxType && (
              <View>
                <View style={styles.subHeader}>
                  <Text style={styles.subHeaderText}>Secondary Box2-{secondaryBox2?.boxType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Secondary connection</Text>
                  <Text style={styles.rowValue}>₹{secondaryBox2?.boxPrice}</Text>
                </View>

                {secondaryBox2?.pack.map((item: any) => (
                  <View key={item.pack} style={styles.row}>
                    <Text style={styles.rowLabel}>{item?.pack}</Text>
                    <Text style={styles.rowValue}>₹{item?.price}</Text>
                  </View>
                ))}

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>NCF</Text>
                  <Text style={styles.rowValue}>₹{secondaryBox2?.NCF}</Text>
                </View>
              </View>
            )}

            {/* Secondary Box 3 */}
            {secondaryBox3?.boxType && (
              <View>
                <View style={styles.subHeader}>
                  <Text style={styles.subHeaderText}>Secondary Box3-{secondaryBox3?.boxType}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Secondary connection</Text>
                  <Text style={styles.rowValue}>₹{secondaryBox3?.boxPrice}</Text>
                </View>

                {secondaryBox3?.pack.map((item: any) => (
                  <View key={item.pack} style={styles.row}>
                    <Text style={styles.rowLabel}>{item?.pack}</Text>
                    <Text style={styles.rowValue}>₹{item?.price}</Text>
                  </View>
                ))}

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>NCF</Text>
                  <Text style={styles.rowValue}>₹{secondaryBox3?.NCF}</Text>
                </View>
              </View>
            )}
          </View>

          <Text style={styles.footerNote}>
            *This quote has been generated only for the reference of the customer and is valid only until today midnight. Prices are indicative and may be subject to change due to
            various factors, at the sole discretion of Tata Play Limited. Activation and Installation charges are included in connection charges. NCF charges have been included in
            the pack price above if NCF charges have been shown as zero. Monthly packs will be charged as applicable. Tata Sons Private Limited Used under License by Tata Play
            Limited.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(QuotationPortalDetails);
