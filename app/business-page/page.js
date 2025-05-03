// pages/business.js
import BusinessCard from '../components/cards/BusinessCard';

export default function BusinessPage() {
  return (
    <div className="p-4 space-y-8">
      
      {/* Cafés Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cafés</h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          <BusinessCard
            coverImageUrl="/cafe-cover1.jpg"
            logoUrl="/cafe-logo1.png"
            businessName="Coffee House"
            description="Best coffee in town."
          />
          <BusinessCard
            coverImageUrl="/cafe-cover2.jpg"
            logoUrl="/cafe-logo2.png"
            businessName="Morning Brew"
            description="Freshly brewed happiness."
          />
        </div>
      </section>

      {/* Salons Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Salons</h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          <BusinessCard
            coverImageUrl="/salon-cover1.jpg"
            logoUrl="/salon-logo1.png"
            businessName="Glamour Salon"
            description="Your beauty, our passion."
          />
          <BusinessCard
            coverImageUrl="/salon-cover2.jpg"
            logoUrl="/salon-logo2.png"
            businessName="Style Studio"
            description="Redefine your look."
          />
        </div>
      </section>

    </div>
  );
}
