# オレBot [http://orebot.herokuapp.com](http://orebot.herokuapp.com)


## STEP1. デプロイ情報
- チャットボットをデプロイしたサーバーのURL
	- [http://orebot.herokuapp.com](http://orebot.herokuapp.com)
- デプロイに使ったサービス
	- heroku

## STEP2. 必須機能の実装
- コマンドの第一引数をBotモジュールで処理をして、それ以降の引数は各コマンドのモジュールに引き渡す構造にすることで、コマンドの追加・拡張をしやすい設計を心がけた
- upsertでタスクの上書きを可能にした

## STEP3. 独自コマンドの実装

### talkコマンド `bot talk`

````
bot talk [発話テキスト]
-> [返答テキスト]
````

docomo Developer supportで公開されている雑談対話APIを利用して、ユーザの発話テキストから自然な雑談を提供します。  
また、過去の会話を遡って文脈を維持した会話が可能となっています。（例えば、食事の話をしていたら、それに続く会話も食事に関する返答が返ってきます）



### fitコマンド `bot fit [option]`

````
bot fit step
-> Todays my steps: [steps]

bot fit heart
-> My latest heart-rate: ♡[heartrate]
````

Fitbit APIを利用して、作者自身の身体的な活動情報を知ることができます。  
私が24時間装着しているリストバンドから、心拍数・歩数の情報を提供します。

### songコマンド `bot song`

````
bot song
-> Recent Track: ワンダーランド (Flip)
-> NowPlaying♪♪: ワンダーランド (Flip)
````

Last.fm APIを利用して、作者が一番最近聞いた楽曲を知ることができます。  
作者自身のiPhone, iTunes, Spotifyのいずれかで再生している楽曲名・アーティストの情報を提供します。

作者自身がリアルタイムに楽曲を再生している場合は「NowPlaying」と表示されます。



### helpコマンド `bot help`

````
bot help
-> see this: https://github.com/iyuto/sprint-bot/blob/master/answer.md
````

## 今回の開発に使用した技術

- 使用した技術
	- JavaScript
	- Node.js
	- MongoDB
- npmライブラリ
	- express
	- ws
	- request
	- mongoose
	- fitbit-node
	- lastfmapi
- 使用したWebAPI
	- [Fitbit API](https://dev.fitbit.com/docs/)
	- [Last.fm API](http://www.last.fm/api/intro)
	- [docomo 雑談対 API](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=dialogue&p_name=api_usage_scenario)

## その他独自実装した内容の説明
- チャットIDについて
	- チャット部屋にアクセスした際に、各クライアントにIDを割り振った
	- 入退出を検出して、誰がチャット部屋に入退出したのかを全クライアントに通知する

## その他創意工夫点、アピールポイントなど
名前の通り、「オレBot」です。オレのオレによるオレのためのBotです。  
ネット上に仮想の「オレ」を作ることを最終目標として製作しました。

fitコマンドでは作者が24時間着けているFitbitリストバンドの情報を見ることで、作者の身体的な活動情報が分かります。  
songでは作者が最後に聞いた曲、もしくは今現在聞いている曲を知ることができます。
