declare interface userData {
    /** ユーザーリスト */
    user: {
        [/** ユーザーID */ userId: string]: {
            /** ユーザー名 */
            userName: string;
            /** パスワード */
            password: string;
            /** メモ帳のリスト */
            data: {
                /** userText内のパスリンク */
                [/** メモ帳の名前 */ memoName: string]: string;
            };
        };
    };
}
declare interface request {
    type: "MemoListGet" | "MemoTextGet" | "UserTest"
    data: {
        userName: string,
        password: string
    }
}
