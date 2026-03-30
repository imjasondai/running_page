import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';

// only support China for now
const LocationSummary = () => {
  const { years, countries, provinces, cities } = useActivities();
  return (
    <div className="cursor-pointer">
      <section>
        {years ? (
          <Stat value={`${years.length}`} description=" Years Running" />
        ) : null}
        {countries ? (
          <Stat value={countries.length} description=" Countries" />
        ) : null}
        {provinces ? (
          <Stat value={provinces.length} description=" Provinces" />
        ) : null}
        {cities ? (
          <Stat value={Object.keys(cities).length} description=" Cities" />
        ) : null}
      </section>
      <hr />
    </div>
  );
};

export default LocationSummary;
