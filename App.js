/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
	useEffect,
	useState,
	useRef,
} from 'react';

import {
	Colors,
	Text,
	useColorScheme,
	SafeAreaView,
	TextInput,
	StyleSheet,
	View,
	ScrollView,
	Button,
} from 'react-native';

const Message = ({msg: {text, pseudo, date}}) => {
	return (
	<>
		<View style={{flex: 1, flexDirection: "row"}}>
			<Text style={{width: 150}}>{date}</Text>
			<Text style={{flex: 1}}>{pseudo} :</Text>
		</View>
		<Text style={{marginBottom: 20}}>{text}</Text>
	</>
	);
}


const Messages = ({scrollRef, data}) => {
  return (
	<ScrollView ref={scrollRef} contentInsetAdjustmentBehavior="automatic"  style={{ flex: 1, marginBottom: 10}}>
		{data.map((d, i) => <Message key={i} msg={d} />)}
	</ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
	  padding: 20,
  },
});

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


var count = 0;
var fetched = false;

var webSocket = new WebSocket("ws://websocket.novaschola.club:3000");
webSocket.onopen = function (event) {
};

const App: () => Node = () => {

	var scrollRef = useRef();
	const [inputText, setInputText] = useState("");
	const [pseudo, setPseudo] = useState("anon");
	const [editable, setEditable] = useState(false);
	const [data, setData] = useState([{text: "Hello !!!", date: "01/01/2021 00:00:00", pseudo: "Pseudo"}]);

	useEffect(() => {

		if (scrollRef.current)
			scrollRef.current.scrollToEnd({animated: true});

		webSocket.onmessage = function (event) {
			addMessage(JSON.parse(event.data));
		}

		return () => {
			webSocket.onmessage = () => {};
		};


	});

	function addMessage(msg) {
		setData(data.concat([msg]));
	}

	function sendMsg() {
		webSocket.send(JSON.stringify({
			pseudo,
			text: inputText,
			date: "01/01/2021 00:00:00"
		}));
		setInputText("");
	}


	return (
		<View style={[styles.container, {flexDirection: "column"}]}>
			{editable ?
				<View style={{ height: 50, }}>
					<View style={{ flex: 1, flexDirection: "row", height: 50,  }}>
						<TextInput
							onChangeText={setPseudo}
							value={pseudo}
							style={{ flex: 1, backgroundColor: "lightgrey", borderColor: "black", borderStyle: "solid", borderWidth: 1 }}
						/>
						<Button title="ok" style={{width: 30}} color="grey" style={{borderColor: "black", borderStyle: "solid", borderWidth: 5}} onPress={() => setEditable(false)} />
					</View>
				</View>  :
				<Text style={{ height: 25, color: "white", backgroundColor: "black", borderColor: "black", borderStyle: "solid", borderWidth: 1 }} onPress={() => setEditable(true)}>{pseudo}</Text>
			}
			<Messages scrollRef={scrollRef} data={data}/>
			<View style={{ height: 50, }}>
				<View style={{ flex: 1, flexDirection: "row", height: 50,  }}>
					<TextInput
						onChangeText={setInputText}
						value={inputText}
						style={{ flex: 1, backgroundColor: "lightgrey", borderColor: "black", borderStyle: "solid", borderWidth: 1 }}
					/>
					<Button title="ok" style={{width: 30}} color="grey" style={{borderColor: "black", borderStyle: "solid", borderWidth: 5}} onPress={sendMsg} />
				</View>
			</View>
		</View>
	);
};


export default App;
