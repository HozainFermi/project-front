import { Outlet } from 'react-router-dom';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/models/apartment/scene.gltf");
  return <primitive object={gltf.scene} scale={0.2} position={[0, -20, 0]}  />;
};

export default function AuthLayout() {
  return (
    <Flex minH="100vh" width="100vw" overflowX="hidden" bg="gray.900" color="white">
      {/* Левая часть с формой */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 6, md: 12 }}
        bg="gray.900" // важный фон, чтобы не было просветов
      >
        <Box w="100%" maxW="650px" bg="gray.800" rounded="xl" p={8} shadow="2xl">
          <Heading size="lg" mb={2}>
            Вход в ЖКХ портал
          </Heading>
          <Text mb={6} color="gray.300">
            Для жильцов, сотрудников и администраторов управляющей компании.
          </Text>
          <Outlet />
        </Box>
      </Box>

      {/* Правая часть - на всю оставшуюся ширину */}
      <Box
        flex="1"        
        display={{ base: 'none', lg: 'block' }}
        position="relative"
        bg="gray.900"
        zIndex={5}
      >
        {/* Canvas на всю высоту и ширину родителя */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
        >
          <Canvas
            camera={{ 
              position: [40, 60, 90],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block',
              background: 'gray.900' 
            }}
          >
            <Suspense fallback={null}>
              <Model />
              <OrbitControls
                autoRotate={true}
                autoRotateSpeed={1.5}
                enableZoom={false}
                enablePan={false}
                enableRotate={false}                
                target={[30, 30, -30]}
              />
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
            </Suspense>
          </Canvas>
        </Box>

        {/* Текст поверх Canvas */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={16}
          zIndex={10}
          pointerEvents="none"
        >
          <Box 
            textAlign="center"
            bg="blackAlpha.600"
            p={8}
            rounded="xl"
            backdropFilter="blur(10px)"
          >
            <Heading size="3xl" mb={6} color="white">
              Дом, двор, город — в одном окне
            </Heading>
            <Text fontSize="lg" maxW="550px" mx="auto" color="whiteAlpha.900">
              Здесь можно передавать показания, смотреть новости дома и быстро
              общаться с управляющей компанией.
            </Text>
          </Box>

        </Box>
      </Box>
    </Flex>
  );
}