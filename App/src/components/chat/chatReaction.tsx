import React from "react";
import { Dimensions, FlatList, View } from "react-native";
import { WebView } from "react-native-webview";

const width = Dimensions.get("window").width;
const itemSize = width / 3 - 2; // Định kích thước từng ô WebView

const listGif = [
    {
        id: "4521515897862203803",
        link: "https://tenor.com/view/pepe-gif-4521515897862203803",
    },
    {
        id: "24077664",
        link: "https://tenor.com/view/meme-pepe-gif-24077664",
    },
    {
        id: "17829017977941587152",
        link: "https://tenor.com/view/vibe-cat-pepe-sad-pepe-vibing-cat-gif-17829017977941587152",
    },
    {
        id: "5715699349696545934",
        link: "https://tenor.com/view/pepe-rofl-pepe-pepe-the-frog-frog-rofl-gif-5715699349696545934",
    },
    {
        id: "14629696721899528776",
        link: "https://tenor.com/view/pepe-smart-pepe-watch-think-pepe-you-smart-smart-watch-gif-14629696721899528776",
    },
    {
        id: "22458426",
        link: "https://tenor.com/view/ok-hand-pepe-ok-frog-pepe-the-frog-gif-22458426",
    },
    //<div class="tenor-gif-embed" data-postid="8133573233173324834" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/angry-pepe-pepe-the-frog-frog-triggered-gif-8133573233173324834">Angry Pepe Pepe The Frog GIF</a>from <a href="https://tenor.com/search/angry+pepe-gifs">Angry Pepe GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
    {
        id: "8133573233173324834",
        link: "https://tenor.com/view/angry-pepe-pepe-the-frog-frog-triggered-gif-8133573233173324834"
    },
    //<div class="tenor-gif-embed" data-postid="5750308198085825877" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/noob-gif-5750308198085825877">Noob Sticker</a>from <a href="https://tenor.com/search/noob-stickers">Noob Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
    {
        id: "5750308198085825877",
        link: "https://tenor.com/view/noob-gif-5750308198085825877"
    },
    //<div class="tenor-gif-embed" data-postid="17018378" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/pepe-the-frog-shaking-crying-tears-gif-17018378">Pepe The Frog Shaking Sticker</a>from <a href="https://tenor.com/search/pepe+the+frog-stickers">Pepe The Frog Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
    {
        id: "17018378",
        link: "https://tenor.com/view/pepe-the-frog-shaking-crying-tears-gif-17018378"
    },
];

const ChatReaction = () => {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={listGif}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                    <WebView
                        source={{
                            html: `
                                    <html>
                                        <head>
                                            <script async src="https://tenor.com/embed.js"></script>
                                        </head>
                                        <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center;">
                                            <div class="tenor-gif-embed" data-postid="${item.id}" data-share-method="host" data-width="100%" data-height="100%">
                                            <a href="${item.link}">View GIF</a>
                                            </div>
                                        </body>
                                    </html>
                                `,
                        }}
                        style={{
                            width: itemSize,
                            height: itemSize,
                            backgroundColor: "transparent",
                        }}
                        mixedContentMode="always"
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={["*"]}
                        scalesPageToFit={false}
                        scrollEnabled={false}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                windowSize={6} // Chỉ render 6 item cùng lúc để tối ưu hiệu suất
                removeClippedSubviews={true} // Giúp FlatList không render item ngoài màn hình

            />
        </View>
    );
};

export default ChatReaction;
