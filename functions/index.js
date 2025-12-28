const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

// Callable function (admin only)
exports.sendMaintenanceEmails = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login required"
      );
    }

    // Check admin role
    const userDoc = await admin
      .firestore()
      .doc(`users/${context.auth.uid}`)
      .get();

    if (userDoc.data().role !== "ADMIN") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin only"
      );
    }

    const { month, amount } = data;

    const usersSnap = await admin.firestore()
      .collection("users")
      .where("role", "==", "USER")
      .get();

    const emails = usersSnap.docs.map(u => u.data().email);

    const mailOptions = {
      from: `"Sushila Enclave" <${functions.config().gmail.email}>`,
      subject: `Maintenance generated for ${month}`,
      text: `Maintenance of ₹${amount} has been generated for ${month}. Please log in to check details.`,
    };

    await Promise.all(
      emails.map(email =>
        transporter.sendMail({ ...mailOptions, to: email })
      )
    );

    return { success: true, sent: emails.length };
  }
);
