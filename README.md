# 電子チケット

公演ポータル (ls-portal) の予約1件ぶんの電子チケットを表示するページ。
URL: `https://ymatusita21-dotcom.github.io/ticket/#api=<公演ポータルのURL>&id=<公演ID>&token=<予約のQRトークン>`

- 情報は開いた時に公演ポータルの doPost `action: 'ticket'` から取得する。このリポジトリに個人情報は置かない。
- 公演当日は4秒おきに入場・特典の状態を確かめ、受付で読み取られると「入場済み」に変わる。
- 一度開いたチケットは端末に保存され、電波が無くてもQRを表示できる。
- index.html を変えたら sw.js の CACHE 名を上げる。
- 公演ポータルのURL・キー・個人情報はこのリポジトリに書かない (URLの # 以降で渡す)。

## edit.html (予約の変更・キャンセル)

公演ポータルの EditReservation.html から `node tools/build-editres-pages.mjs ../ticket` で作る (ここで直接直さない)。
`edit.html#api=<公演ポータル>&id=<公演ID>&t=<編集トークン>` で開く。予約完了メールの「編集URL」がこの形になる。
