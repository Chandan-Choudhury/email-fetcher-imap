require("dotenv").config();
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const config = require("./config");
const mysql = require("mysql");

const imapConfig = {
  user: config.USER,
  password: config.PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

const getEmails = () => {
  try {
    const imap = new Imap(imapConfig);
    console.log("Connecting to IMAP server.");
    imap.once("ready", () => {
      console.log("Connected to IMAP server.");
      imap.openBox("INBOX", false, () => {
        console.log("Inside Inbox.");
        console.log("Waiting for new emails.");
        imap.on("mail", (mail) => {
          console.log("Searching for new emails.");
          console.log("new email: " + mail);
          imap.search(["UNSEEN", ["FROM", config.SENDER]], (err, results) => {
            console.log("Searching for unread emails from sender chandan.");
            const f = imap.fetch(results, { bodies: "" });
            f.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  const {
                    headers,
                    to,
                    from,
                    subject,
                    text,
                    cc,
                    bcc,
                    date,
                    messageId,
                    inReplyTo,
                    replyTo,
                    textAsHtml,
                    references,
                    html,
                  } = parsed;
                  //   console.log("headers: ", headers.text);
                  //   console.log("to: ", to.text);
                  //   console.log("From: ", from.text);
                  //   console.log("Subject: ", subject);
                  //   console.log("Text: ", text);
                  //   console.log("cc: ", cc);
                  //   console.log("bcc: ", bcc);
                  //   console.log("date: ", date);
                  //   console.log("messageId: ", messageId);
                  //   console.log("inReplyTo: ", inReplyTo);
                  //   console.log("replyTo: ", replyTo);
                  //   console.log("references: ", references);
                  // console.log("html: ", html);
                  var con = mysql.createConnection({
                    host: config.DB_HOST,
                    user: config.DB_USER,
                    password: config.DB_PASSWORD,
                    database: config.DB_NAME,
                  });
                  con.connect(function (err) {
                    if (err) throw err;
                    console.log("Connected!");
                    var sql =
                      "INSERT INTO email (`headers`, `to`, `from`, `subject`, `text`, `cc`, `bcc`, `date`, `messageId`, `inReplyTo`, `replyTo`, `textAsHtml`, `references`, `html`) VALUES ('" +
                      headers.text +
                      "', '" +
                      to.text +
                      "', '" +
                      from.text +
                      "', '" +
                      subject +
                      "', '" +
                      text +
                      "', '" +
                      cc +
                      "', '" +
                      bcc +
                      "', '" +
                      date +
                      "', '" +
                      messageId +
                      "', '" +
                      inReplyTo +
                      "', '" +
                      replyTo +
                      "', '" +
                      textAsHtml +
                      "', '" +
                      references +
                      "', '" +
                      html +
                      "')";
                    con.query(sql, function (err, result) {
                      if (err) throw err;
                      console.log("record inserted");
                    });
                  });
                });
              });
              msg.once("attributes", (attrs) => {
                const { uid } = attrs;
                imap.addFlags(uid, ["\\Seen"], () => {
                  console.log("Marked as read!");
                });
              });
            });
            f.once("error", (ex) => {
              return Promise.reject(ex);
            });
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.log(err);
    });
    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (error) {
    console.log(error);
  }
};

getEmails();
