import { useEffect, useState } from "react"
import { addTokenToDatabase, deleteTokenFromDatabase, getTokensFromDatabase } from "../database/token";
import adminResponsiveStyles from '../styles/adminResponsiveStyles.module.css';

const MODALS =
{
    PAGE:
    {
        INFO: "INFO",
        TOKENS: "TOKENS",
    }
}


const styles =
{
    Admin: {
        backgroundColor: "#dbdbdb",
        height: "100%",
        width: "100%",
    },

    ChangePageLink: {
        margin: "auto",
        textDecoration: "underline",
        color: "#dbdbdb",
        cursor: "pointer",
        width: "max-content",
    },


    Info: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#050505",
        height: "100%",
        width: "100%",
        padding: "20px",
        paddingTop: "30px",
    },

    InfoBox: {
        borderRadius: "10px",
        backgroundColor: "#222222",
        color: "#dbdbdb",
        minWidth: "98%",
        maxWidth: "100%",
        maxHeight: "98%",
        padding: "10px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },

    Tokens: {
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        backgroundColor: "#050505",
        height: "100%",
        width: "100%",
    },

    AddTokenModule: {
        padding: "10px",
        backgroundColor: "#111111",
        width: "100%",
        marginBottom: "10px",
        borderRadius: "10px",
        border: "2px solid #dbdbdb50",
    },

    Token: {

        padding: "20px",
        backgroundColor: "#111111",
        minWidth: "50%",
        maxWidth: "100%",
        width: "max-content",
        borderRadius: "10px",
        margin: "auto",
        marginTop: "20px",
        border: "2px solid #dbdbdb50",
    },

    TokenText: {
        margin: "auto",
        maxWidth: "100%",
        width: "max-content",
        padding: "10px",
        marginTop: "5px",
        backgroundColor: "#111111",
        color: "#dbdbdb",
        // border: "2px solid #dbdbdb50",
        borderRadius: "5px",
        outline: "none",
        wordBreak: "break-all"
    },



    BearerInput: {
        width: "100%",
        padding: "10px",
        marginTop: "10px",
        backgroundColor: "#222222",
        color: "#dbdbdb",
        border: "2px solid black",
        borderRadius: "5px",
        outline: "none",
        textAlign: "center",
    },

    AddBearerButton: {
        width: "max-content",
        backgroundColor: "#131313",
        color: "#dbdbdb",
        margin: "auto",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "5px",
        border: "1px solid #dbdbdb30",
        cursor: "pointer"
    },

    TokenContainer:
    {
        overflowY: "scroll"
    },

    DeleteBearerButton: {
        width: "max-content",
        backgroundColor: "#131313",
        color: "#dbdbdb",
        margin: "auto",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "5px",
        border: "1px solid #dbdbdb30",
        cursor: "pointer"
    },
    InfoText:
    {
        textAlign: "center",
    }
}



function Info({
    setSelectedPageModal,
    tokens,
    setRefreshTokens,
}) {

    const requestPerAccount = 250;
    const retweeterPerRequest = 100;
    const numberOfServiceAccounts = tokens?.length;
    const requestMaximum = numberOfServiceAccounts * requestPerAccount;
    const retweeterMaximum = requestMaximum * retweeterPerRequest;

    function getSumOfFetchedRetwitters(tokens) {
        let sum = 0;
        for (let index in tokens) {
            sum = sum + tokens[index].fetched;
        }
        return sum;
    }

    function getSumOfRequests(tokens) {
        let sum = 0;
        for (let index in tokens) {
            sum = sum + tokens[index].requests;
        }
        return sum;
    }

    const totalFetched = getSumOfFetchedRetwitters(tokens);
    const totalRequests = getSumOfRequests(tokens);

    // useEffect(() => {
    //     setRefreshTokens((current) => !current);
    // }, [])


    return (
        <div style={styles.Info}>
            <h2 style={styles.ChangePageLink} onClick={() => {
                setSelectedPageModal(MODALS.PAGE.TOKENS);
                setRefreshTokens((current) => !current);
            }}>
                Add Tokens to Service
            </h2>
            <div className={adminResponsiveStyles.InfoGrid}>

                <div style={styles.InfoBox}>
                    <h1 style={styles.InfoText}>  {"Picker Admin Panel"} </h1>
                </div>


                <div style={styles.InfoBox}>
                    <h3 style={styles.InfoText}>  {"We currently have "} </h3>
                    <h1 style={styles.InfoText}>  {numberOfServiceAccounts} </h1>
                    <h3 style={styles.InfoText}>  {"accounts running the microservice."} </h3>
                </div>

                {/* <div style={styles.InfoBox}>
                    <h3 style={styles.InfoText}>  {"we currently made "} </h3>
                    <h1 style={styles.InfoText}> {totalRequests} out of {requestMaximum} </h1>
                    <h3 style={styles.InfoText}>  {"requests per month"} </h3>
                </div>

                <div style={styles.InfoBox}>
                    <h3 style={styles.InfoText}>  {"we currently fetched"} </h3>
                    <h1 style={styles.InfoText}> {totalFetched} out of {retweeterMaximum} </h1>
                    <h3 style={styles.InfoText}>  {"retweeter's info in this session"} </h3>
                </div> */}
            </div>
        </div>
    )
}



function AddTokenModule({ setSelectedPageModal, setTokens, setRefreshTokens }) {

    const [token, setToken] = useState("");

    async function addToken() {
        if (token === "") return;

        const newToken = {
            token: token,
            requests: 0,
            fetched: 0,
        };

        // add token to db
        await addTokenToDatabase(token, 0, 0);
        //
        setTokens((current) => [...current, newToken]);
        setRefreshTokens((current) => !current);
        setToken("");
    }


    return (

        <div style={styles.AddTokenModule}>

            <h2 style={styles.ChangePageLink}
                onClick={() => {
                    setSelectedPageModal(MODALS.PAGE.INFO);
                    setRefreshTokens((current) => !current);
                }}>
                {"See Overall Info"}
            </h2>

            <input style={styles.BearerInput}
                value={token}
                onChange={(event) => { setToken(event.target.value) }}
                placeholder="Bearer Token" type="text"
            />
            <div
                style={styles.AddBearerButton}
                onClick={async () => { await addToken() }}
            >
                add token
            </div>


        </div>
    )
}


function Token({ token, index, setRefreshTokens }) {

    async function deleteToken() {
        const {data, error} = await deleteTokenFromDatabase(token.token);
        setRefreshTokens((current) => !current);
    }



    return (
        <div style={styles.Token}>
            <div style={styles.TokenText}>
                token no: {index}
            </div>
            <div style={styles.TokenText}>
                Bearer Token : {token.token}
            </div>
            <div style={styles.TokenText}>
                {token.requests} requests has been made by the token.
            </div>
            <div style={styles.TokenText}>
                {token.fetched} retweeters has been fetched by the token.
            </div>
            <div
                style={styles.DeleteBearerButton}
                onClick={async () => { await deleteToken() }}
            >
                Delete  token
            </div>
        </div>
    )
}


function Tokens({
    setSelectedPageModal,
    tokens,
    setTokens,
    setRefreshTokens,
}) {




    return (
        <div style={styles.Tokens}>
            <AddTokenModule
                setSelectedPageModal={setSelectedPageModal}
                setTokens={setTokens}
                setRefreshTokens={setRefreshTokens}
            />
            <div style={styles.TokenContainer}>
                {
                    tokens.map((token, index) => {
                        return (
                            <Token key={index}
                                index={index + 1}
                                token={token}
                                setRefreshTokens={setRefreshTokens}
                            />
                        )
                    })
                }
            </div>

        </div>
    )
}

export default function Admin() {

    const [refreshTokens, setRefreshTokens] = useState(false);
    const [tokens, setTokens] = useState([]);

    async function fetchTokens() {
        let { data, error } = await getTokensFromDatabase();
        setTokens(data);
    }

    useEffect(() => {
        fetchTokens();
    }, [refreshTokens])


    const [selectedPageModal, setSelectedPageModal] = useState(MODALS.PAGE.INFO);

    return (
        <div style={styles.Admin}>
            {
                (selectedPageModal == MODALS.PAGE.INFO) &&
                <Info
                    setSelectedPageModal={setSelectedPageModal}
                    tokens={tokens}
                    setRefreshTokens={setRefreshTokens}
                />
            }
            {
                (selectedPageModal == MODALS.PAGE.TOKENS) &&
                <Tokens
                    tokens={tokens}
                    setTokens={setTokens}
                    setRefreshTokens={setRefreshTokens}
                    setSelectedPageModal={setSelectedPageModal}
                />
            }
        </div>
    )
}
