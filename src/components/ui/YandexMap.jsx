// components/YandexMap.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  Field,
  HStack
} from '@chakra-ui/react';

const YandexMap = ({ address, onAddressSelect }) => {
  const [mapError, setMapError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(address || '');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapInstance = useRef(null);
  const searchControlInstance = useRef(null);
  const mapInitialized = useRef(false);

  useEffect(() => {
    if (mapInitialized.current) return;

    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=8d310dca-612e-4d50-b7bb-db37952ba8ad&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      script.onerror = () => setMapError('Не удалось загрузить карты');
      document.body.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
        mapInitialized.current = false;
      }
    };
  }, []);

  const initMap = () => {
    if (!window.ymaps || !document.getElementById('map') || mapInitialized.current) return;

    try {
      const mapContainer = document.getElementById('map');
      while (mapContainer.firstChild) {
        mapContainer.removeChild(mapContainer.firstChild);
      }

      mapInstance.current = new window.ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 12
      });

      searchControlInstance.current = new window.ymaps.control.SearchControl({
        options: {
          provider: 'yandex#search'
        }
      });

      mapInstance.current.controls.add(searchControlInstance.current);

      if (address) {
        searchControlInstance.current.search(address);
      }

      searchControlInstance.current.events.add('resultselect', (e) => {
        const result = searchControlInstance.current.getResultsArray()[e.get('index')];
        const selectedAddress = result.properties.get('text');
        const coords = result.geometry.getCoordinates();
        
        onAddressSelect?.({
          address: selectedAddress,
          coordinates: coords
        });
      });

      setIsMapLoaded(true);
      mapInitialized.current = true;
    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
      setMapError('Не удалось инициализировать карту');
    }
  };

  const handleSearch = () => {
    if (!isMapLoaded || !searchQuery.trim()) return;

    window.ymaps.geocode(searchQuery).then((res) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        const address = firstGeoObject.properties.get('text');
        const coords = firstGeoObject.geometry.getCoordinates();
        
        onAddressSelect?.({
          address,
          coordinates: coords
        });

        if (mapInstance.current) {
          mapInstance.current.setCenter(coords, 17);
        }
      }
    }).catch((error) => {
      console.error('Ошибка поиска:', error);
      setMapError('Ошибка при поиске адреса');
    });
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      <Field.Root mb={3}>
        <Field.Label>Поиск адреса</Field.Label>
        <HStack>
          <Input
            placeholder="Введите адрес для поиска"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleKeyUp}
            isDisabled={!isMapLoaded}
          />
          <Button 
            colorScheme="teal" 
            onClick={handleSearch}
            isLoading={!isMapLoaded}
            loadingText="Загрузка"
            isDisabled={!isMapLoaded}
          >
            Найти
          </Button>
        </HStack>
      </Field.Root>
      
      <Box 
        id="map" 
        height="300px" 
        width="100%" 
        borderRadius="md" 
        borderWidth="1px"
        bg="gray.100"
      />
      
      {mapError && (
        <Text color="red.500" mt={2} fontSize="sm">
          {mapError}
        </Text>
      )}
      
      {!isMapLoaded && !mapError && (
        <Text color="gray.500" mt={2} fontSize="sm">
          Загрузка карты...
        </Text>
      )}
    </Box>
  );
};

export default YandexMap;