import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  Platform,
  ScrollView,
  Modal
} from "react-native";
import constants from "../helpers/constants";
import {
  ListItem,
  Button,
  Divider,
  SearchBar,
} from "react-native-elements";
import {
  getCaseData,
  clearCaseData
} from "../store/actions/caseData";
import {
  getCaseConnections,
  clearCaseConnections
} from "../store/actions/caseConnections"
import { connect } from "react-redux";
import Loader from "../components/Loader/Loader";
import CaseListComponent from "../components/CaseListComponent";
import ConnectionsView from "./ConnectionsView";

export function CaseViewScreen(props) {

  const [searchKeywords, setSearchKeywords] = useState('')

  const [connectionSelected, setConnectionSelected] = useState({
    connectionOpen: false,
    connectionData: {},
  })

  const styles = StyleSheet.create({
    tabs: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around"
    },

    selected: {
      backgroundColor: constants.highlightColor,
      color: "white",
      borderWidth: 1,
      borderColor: constants.highlightColor,
      borderRadius: 4,
      overflow: "hidden"
    },

    tab: {
      padding: 10,
      fontSize: 16
    },

    searchBar: {
      marginHorizontal: Platform.OS === "ios" ? 5 : 5,
      width: Platform.OS === "ios" ? 285 : 320,
      backgroundColor: Platform.OS === "ios" ? "white" : "white"
    },
  });

  // ------SEARCHBAR functionality - filters by case first_name or last_name---------
  let SearchedConnections = props.caseConnections.filter(result => {
    return result.person.full_name.indexOf(searchKeywords) != -1;
  });



  // on load get case data and case connections through redux
  useEffect(() => {
    props.getCaseData(props.pk);
    props.getCaseConnections(props.pk);
  }, [false]);


  let caseData = props.caseData;
  // console.log(props.caseData);

  const handleKeywordChange = (e) => {

    setSearchKeywords(e)

  }

  return (
    <View style={{ height: '100%' }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {props.isLoadingCaseData ? (
          <Loader />
        ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 55,
                width: "85%"
              }}
            >
              <View>
                <Text style={{ fontSize: 20 }}>{caseData.full_name}</Text>
                <ListItem
                  leftAvatar={{
                    source: {
                      uri:
                        caseData.picture ||
                        "https://www.trzcacak.rs/myfile/full/214-2143533_default-avatar-comments-default-avatar-icon-png.png"
                    }
                  }}
                />
              </View>
              <View style={{ maxWidth: "60%" }}>
                <Text style={{ padding: 5 }}>Gender: {caseData.gender}</Text>
                <Text style={{ padding: 5 }}>
                  Date of Birth: {caseData.birthday}
                </Text>
                <Text style={{ padding: 5 }}>
                  Residence:{" "}
                  {caseData.address && caseData.address.formatted
                    ? caseData.address.formatted
                    : "No address provided."}
                </Text>
                <Text style={{ padding: 5 }}>
                  Initiation:{caseData.foster_care}
                </Text>
              </View>
            </View>
          )}


        {/* search Functionality */}

        <View style={{ flexDirection: "columb" }}>
          <Text style={{ margin: 10, fontSize: 20 }}>Connections:</Text>
          <SearchBar
            placeholder="Search Name..."
            placeholderTextColor="black"
            lightTheme
            round
            name="searchKeywords"
            value={searchKeywords}
            onChangeText={handleKeywordChange}
            // create searchbar target platform.os
            platform="ios"
            containerStyle={styles.searchBar}
          />
        </View>

        <Divider
          style={{
            height: 1,
            backgroundColor: "lightgrey",
            width: "85%",
            marginTop: 15
          }}
        />
      </View>


      <ScrollView style={{ height: '55%' }}>
        {props.isLoadingConnections ? (
          <Loader />
        ) : (

            SearchedConnections.map((connection, index) => {
              return (
                <CaseListComponent
                  pressed={() => {
                    console.log('Please Work!********************************************')
                    console.log(connection)
                    setConnectionSelected({
                      connectionOpen: true,
                      connectionData: connection
                    })
                  }}
                  key={index}
                  connection={connection} />
              );
            })
          )}

        {/* CASE onPress MODAL */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={connectionSelected.connectionOpen}
        >
          <ConnectionsView
            connectionData={connectionSelected}
            closeCase={() => {
              setConnectionSelected({ connectionOpen: false, connectionData: {} });
            }}
          />

        </Modal>


      </ScrollView>

      <View style={{
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Divider
          style={{
            height: 1,
            backgroundColor: "lightgrey",
            width: "85%",
          }}
        />
      </View>


      <TouchableHighlight
        underlayColor="lightgray"
        style={{ alignItems: "center" }}
        onPress={() => {
          props.clearCaseData();
          props.clearCaseConnections();
          props.setCaseVisible();
        }}
      >
        <Text
          style={{
            marginVertical: 30,
            padding: 10,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: `${constants.highlightColor}`,
            color: `${constants.highlightColor}`
          }}
        >
          Close Case
        </Text>
      </TouchableHighlight>
    </View>
  );
}

const mapStateToProps = state => {
  const { caseData, isLoadingCaseData, caseDataError } = state.caseData;
  const { caseConnections, isLoadingConnections, connectionsError } = state.caseConnections;
  return {
    caseData,
    isLoadingCaseData,
    isLoadingConnections,
    caseDataError,
    connectionsError,
    caseConnections
  };
};

export default connect(
  mapStateToProps,
  {
    getCaseData,
    clearCaseData,
    getCaseConnections,
    clearCaseConnections
  }
)(CaseViewScreen);
