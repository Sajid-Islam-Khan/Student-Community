import React from 'react';

const LegalAgreement: React.FC = () => {
    return (
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-3xl font-bold mb-4">CampusNet: Terms of Service</h1>

            <div className="mb-8">
                <h2 className="text-xl font-bold">1. Introduction</h2>
                <p>Welcome to CampusNet, a student community platform designed to connect students and facilitate academic and social interactions. By accessing or using this Platform, you agree to abide by these Terms of Service.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold">2. User Agreement</h2>
                <p>
                    a. <strong>Eligibility:</strong> Users must be students or individuals associated with educational institutions to use the Platform.
                </p>
                <p>
                    b. <strong>User Conduct:</strong> Users agree to conduct themselves responsibly and respectfully on the Platform, refraining from any behavior that violates the law or infringes upon the rights of others.
                </p>
                <p>
                    c. <strong>Content Guidelines:</strong> Users are responsible for the content they post on the Platform and must not post any content that is unlawful, harmful, or infringes upon intellectual property rights.
                </p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold">3. Privacy Policy</h2>
                <p>
                    a. <strong>Data Collection:</strong> We collect and use personal information as outlined in our Privacy Policy, which forms part of these Terms of Service.
                </p>
                <p>
                    b. <strong>Third-Party Services:</strong> The Platform may integrate with third-party services, and users agree to their data being shared with these services as necessary for functionality.
                </p>
            </div>

            {/* Include other sections of the legal agreement similarly */}

            <p className="text-sm mt-8">
                By accessing or using this Platform, you agree to these Terms of Service. If you do not agree with these terms, please do not use the Platform.
            </p>
        </div>
    );
};

export default LegalAgreement;