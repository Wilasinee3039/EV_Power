import db from '../src/config/database.js';
import User from '../src/models/User.js';
import Lead from '../src/models/Lead.js';

const runQuery = (sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const seedDatabase = async () => {
  try {
    console.log('Seeding database with test data...');

    // Clear existing data in sequence to satisfy foreign key constraints
    await runQuery('DELETE FROM activity_logs');
    await runQuery('DELETE FROM leads');
    await runQuery('DELETE FROM users');

    // Create test user
    const testUser = await User.create('test@evpower.com', 'password123', 'Test User');
    console.log('✓ Created test user:', testUser.email);

    // Sample lead data
    const sampleLeads = [
      // New leads (4)
      { name: 'John Smith', email: 'john@tesla.com', phone: '555-0101', company: 'Tesla Inc', product_interest: 'EV', status: 'New', budget: 50000, notes: 'Interested in fleet electrification' },
      { name: 'Sarah Johnson', email: 'sarah@sunpower.com', phone: '555-0102', company: 'SunPower Corp', product_interest: 'Solar', status: 'New', budget: 100000, notes: 'Looking for commercial solar solutions' },
      { name: 'Mike Chen', email: 'mike@bat.com', phone: '555-0103', company: 'Battery Solutions', product_interest: 'Battery', status: 'New', budget: 75000, notes: 'Interested in energy storage systems' },
      { name: 'Emma Davis', email: 'emma@greentech.com', phone: '555-0104', company: 'GreenTech Industries', product_interest: 'Solar', status: 'New', budget: 60000, notes: 'Exploring renewable energy options' },

      // Contacted leads (4)
      { name: 'Robert Wilson', email: 'robert@autos.com', phone: '555-0201', company: 'Auto Manufacturing', product_interest: 'EV', status: 'Contacted', budget: 150000, notes: 'Had initial call on March 20' },
      { name: 'Lisa Anderson', email: 'lisa@energycorp.com', phone: '555-0202', company: 'Energy Corp', product_interest: 'Battery', status: 'Contacted', budget: 80000, notes: 'Sent proposal on March 21' },
      { name: 'David Martinez', email: 'david@sunfarm.com', phone: '555-0203', company: 'Sun Farm Ltd', product_interest: 'Solar', status: 'Contacted', budget: 95000, notes: 'Follow up needed' },
      { name: 'Jessica Lee', email: 'jessica@transport.com', phone: '555-0204', company: 'Transportation Inc', product_interest: 'EV', status: 'Contacted', budget: 120000, notes: 'Interested in EV fleet conversion' },

      // Quotation leads (4)
      { name: 'Thomas Brown', email: 'thomas@powergrids.com', phone: '555-0301', company: 'PowerGrids Solutions', product_interest: 'Battery', status: 'Quotation', budget: 200000, notes: 'Good fit for energy storage solutions' },
      { name: 'Patricia White', email: 'patricia@solartech.com', phone: '555-0302', company: 'SolarTech Enterprises', product_interest: 'Solar', status: 'Quotation', budget: 110000, notes: 'Ready for detailed proposal' },
      { name: 'Christopher Gray', email: 'chris@evtech.com', phone: '555-0303', company: 'EV Tech Industries', product_interest: 'EV', status: 'Quotation', budget: 180000, notes: 'Budget approved by management' },
      { name: 'Amanda Harris', email: 'amanda@cleanenergy.com', phone: '555-0304', company: 'CleanEnergy Group', product_interest: 'Solar', status: 'Quotation', budget: 140000, notes: 'Requested customized solution' },

      // Won leads (4)
      { name: 'Kevin Clark', email: 'kevin@industrialpower.com', phone: '555-0401', company: 'Industrial Power', product_interest: 'EV', status: 'Won', budget: 175000, notes: 'Proposal sent on March 22, awaiting feedback' },
      { name: 'Deborah Lewis', email: 'deborah@renewables.com', phone: '555-0402', company: 'Renewables Plus', product_interest: 'Battery', status: 'Won', budget: 165000, notes: 'In negotiation phase' },
      { name: 'Matthew Walker', email: 'matt@solardistribution.com', phone: '555-0403', company: 'Solar Distribution', product_interest: 'Solar', status: 'Won', budget: 125000, notes: 'Reviewing contract terms' },
      { name: 'Rachel Young', email: 'rachel@greenbuilding.com', phone: '555-0404', company: 'GreenBuilding Corp', product_interest: 'Solar', status: 'Won', budget: 135000, notes: 'Proposal accepted, awaiting signature' },

      // Lost leads (4)
      { name: 'William hernandez', email: 'bill@greentech2.com', phone: '555-0501', company: 'GreenTech 2.0', product_interest: 'EV', status: 'Lost', budget: 195000, notes: 'Deal closed on March 15. Equipment delivery scheduled.' },
      { name: 'Victoria Taylor', email: 'victoria@solarcorp.com', phone: '555-0502', company: 'SolarCorp Global', product_interest: 'Solar', status: 'Lost', budget: 150000, notes: 'Installation complete, customer satisfied' },
      { name: 'Daniel Thomas', email: 'daniel@batterytech.com', phone: '555-0503', company: 'BatteryTech Solutions', product_interest: 'Battery', status: 'Lost', budget: 185000, notes: 'Contract signed on March 10' },
      { name: 'Michelle Rodriguez', email: 'michelle@ecoenergy.com', phone: '555-0504', company: 'EcoEnergy Systems', product_interest: 'Solar', status: 'Lost', budget: 160000, notes: 'Project completed, onboarding in progress' }
    ];

    // Create sample leads
    for (const leadData of sampleLeads) {
      await Lead.create(leadData, testUser.id);
    }

    console.log(`✓ Created ${sampleLeads.length} sample leads`);
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('  Email: test@evpower.com');
    console.log('  Password: password123');

    db.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
