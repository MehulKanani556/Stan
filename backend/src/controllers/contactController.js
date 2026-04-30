import Contact from "../models/Contact.model.js";
import sendMail from "../helper/sendMail.js";

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required."
            });
        }

        // Save to database
        const newContact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Send email notification to admin (optional but recommended)
        try {
            const adminEmail = process.env.EMAIL_USER;
            const emailSubject = `New Contact Message: ${subject || 'No Subject'}`;
            const emailText = `
                <h3>New Contact Us Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `;

            await sendMail(adminEmail, emailSubject, emailText);
        } catch (mailError) {
            console.error("Error sending contact email:", mailError);
            // We don't fail the request if email fails, as it's saved in DB
        }

        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!",
            data: newContact
        });

    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            error: error.message
        });
    }
};

export const getAllContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching contact messages"
        });
    }
};

export const deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact message deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting contact message"
        });
    }
}
