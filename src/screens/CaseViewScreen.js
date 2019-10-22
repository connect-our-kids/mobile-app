import React, { useState } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import constants from "../helpers/constants";
import { ListItem, Button } from "react-native-elements";
import { Engagement, Participants, Highlights } from "../components/CaseViewTabs";

export default function CaseViewScreen(props) {

  const [tabs, setTabs] = useState({
    engagement: true,
    participants: false,
    highlights: false
  })


  let caseData = props.caseData;
  console.log(props.caseData);
  return (
    <View>
      <View
        style={{
          marginVertical: 200,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>{caseData.full_name}</Text>
        <View>
          <ListItem leftAvatar={{ source: { uri: caseData.picture || "https://www.trzcacak.rs/myfile/full/214-2143533_default-avatar-comments-default-avatar-icon-png.png" } }} />
          <Text>Gender: {caseData.gender}</Text>
          <Text>Date of Birth: {caseData.birthday}</Text>
          <Text>Residence: {caseData.address && caseData.address.formatted ? caseData.address.formatted : "no address available"}</Text>
          <Text>Initiation:{caseData.foster_care}</Text>
        </View>
        <View
          style={{
            alignContent: "center",
            marginVertical: 60,
            marginHorizontal: 30,
            fontSize: 80,
            fontWeight: "bold",
            paddingTop: -10
          }}
        >
          <TouchableHighlight>
            <Button
              buttonStyle={{ backgroundColor: constants.highlightColor }}
              title="Work on Case"
              onPress={() => {
                props.setModalVisible(!props.modalVisible);
              }}
            />
          </TouchableHighlight>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{padding: 10}} onPress={() => { setTabs({ engagement: true, participants: false, highlights: false }) }}>Engagement</Text>
          <Text style={{padding: 10}} onPress={() => { setTabs({ engagement: false, participants: true, highlights: false }) }}>Participants</Text>
          <Text style={{padding: 10}} onPress={() => { setTabs({ engagement: false, participants: false, highlights: true }) }}>Highlights</Text>
        </View>
        <TouchableHighlight
          underlayColor="lightgray"
          onPress={
            () => {
              props.setCaseVisible()
            }}
        >
          <Text>Close Case</Text>
        </TouchableHighlight>
      </View>
      {
        tabs.engagement ? <Engagement caseData={caseData} /> : null
      }
      {
        tabs.participants ? <Participants caseData={caseData} /> : null
      }
      {
        tabs.highlights ? <Highlights caseData={caseData} /> : null
      }
    </View>
  );
}
