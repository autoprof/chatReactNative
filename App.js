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

const App: () => Node = () => {

	var scrollRef = useRef();
	const [inputText, setInputText] = useState("");
	const [data, setData] = useState([{text: "Hello !!!", date: "01/01/2021 00:00:00", pseudo: "Pseudo"}]);

	useEffect(() => {

		if (scrollRef.current)
			scrollRef.current.scrollToEnd({animated: true});


		if (!fetched) fetch("https://jsonplaceholder.typicode.com/posts")
			.then(d => d.json())
			.then(resp => {
				shuffle(resp)
				setData(data.concat(resp.map(d => {
					return {
						date: "01/01/2021 00:00:00",
						pseudo: "Pseudo:" + d.userId,
						text: d.body,
					}
				})));
			});

			fetched = true;

		//~ var id = setInterval(function () {
			//~ addMsg("Message Num: " + count++);
		//~ }, 1000);

		//~ return () => {
			//~ clearInterval(id);
		//~ };

	});

	function addMsg(msg) {
		setData(data.concat([{
			date: "01/01/2021 00:00:00",
			pseudo: "Moi",
			text: "test : " + msg,
		}]));
		setInputText("");
	}

	return (
		<View style={[styles.container, {flexDirection: "column"}]}>
			<Messages scrollRef={scrollRef} data={data}/>
			<View style={{ height: 50, }}>
				<View style={{ flex: 1, flexDirection: "row", height: 50,  }}>
					<TextInput
						onChangeText={setInputText}
						value={inputText}
						style={{ flex: 1, backgroundColor: "lightgrey", borderColor: "black", borderStyle: "solid", borderWidth: 1 }}
					/>
					<Button title="ok" style={{width: 30}} color="grey" style={{borderColor: "black", borderStyle: "solid", borderWidth: 5}} onPress={() => addMsg(inputText)} />
				</View>
			</View>
		</View>
	);
};
/*
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
*/
export default App;
