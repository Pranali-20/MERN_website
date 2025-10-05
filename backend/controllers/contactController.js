const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, category, subject, message } = req.body;

    // Create contact message
    const contact = await Contact.create({
      name,
      email,
      phone,
      category,
      subject,
      message
    });

    // Send confirmation email to user
    try {
      const emailTemplate = emailTemplates.contactConfirmation(name, subject);
      await sendEmail({
        email,
        ...emailTemplate
      });
    } catch (emailError) {
      console.error('Contact confirmation email failed:', emailError);
      // Don't fail the contact submission if email fails
    }

    // Send notification email to admin (optional)
    try {
      await sendEmail({
        email: process.env.EMAIL_USER,
        subject: `New Contact Form Submission - ${category}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: contact
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    // Get status counts for dashboard
    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      statusCounts,
      data: contacts
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update contact message
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactMessage = async (req, res) => {
  try {
    const { status, priority, assignedTo, response } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Update fields
    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (assignedTo) contact.assignedTo = assignedTo;
    
    if (response) {
      contact.response = response;
      contact.respondedAt = new Date();
      contact.respondedBy = req.user.id;
      
      // Send response email to user
      try {
        await sendEmail({
          email: contact.email,
          subject: `Re: ${contact.subject} - Breakfast4U Support`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">Response to Your Inquiry</h2>
              <p>Dear ${contact.name},</p>
              <p>Thank you for contacting Breakfast4U. Here's our response to your inquiry:</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Your Message:</strong></p>
                <p>${contact.message}</p>
                <hr>
                <p><strong>Our Response:</strong></p>
                <p>${response}</p>
              </div>
              <p>If you have any further questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>The Breakfast4U Support Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Response email failed:', emailError);
      }
    }

    await contact.save();

    const updatedContact = await Contact.findById(contact._id)
      .populate('assignedTo', 'name email')
      .populate('respondedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Contact message updated successfully',
      data: updatedContact
    });
  } catch (error) {
    console.error('Update contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage
};