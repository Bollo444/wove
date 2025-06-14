'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, Badge, Modal, Loading, Tooltip } from '../components/ui';

export default function Home() {
  const { user } = useAuth();
  const { ageTier } = useTheme(); // Removed currentTheme
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartStory = async () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      if (user) {
        router.push('/stories/create');
      } else {
        router.push('/login');
      }
    }, 1500);
  };

  const handleExploreStories = () => {
    router.push('/stories');
  };

  const getAgeSpecificContent = () => {
    switch (ageTier) {
      case 'kids':
        return {
          title: 'Welcome to Magical Wove! ✨',
          subtitle: 'Create amazing adventures and magical stories!',
          buttonText: 'Start My Adventure!',
          exploreText: 'Discover Stories',
        };
      case 'teens_u16':
        return {
          title: 'Welcome to Wove 🌟',
          subtitle: 'Express yourself through creative storytelling and connect with friends.',
          buttonText: 'Create My Story',
          exploreText: 'Browse Stories',
        };
      case 'teens_16_plus':
        return {
          title: 'Welcome to Wove',
          subtitle: 'Share your voice and discover diverse perspectives through storytelling.',
          buttonText: 'Start Writing',
          exploreText: 'Explore Community',
        };
      default:
        return {
          title: 'Welcome to Wove',
          subtitle:
            'Create, share, and discover compelling stories. Join our community of storytellers.',
          buttonText: user ? 'Start Your Story' : 'Continue Your Journey',
          exploreText: 'Explore Stories',
        };
    }
  };

  const content = getAgeSpecificContent();

  if (isLoading) {
    return (
      <Loading
        fullScreen
        size="xl"
        variant={ageTier === 'kids' ? 'dots' : 'spinner'}
        text={ageTier === 'kids' ? 'Preparing your magical adventure...' : 'Loading...'}
        data-oid="7dh0bf5"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-text-primary dark:bg-background-dark dark:text-text-primary-dark transition-colors duration-300"
      data-oid="4ql7dly"
    >
      {/* Hero Section */}
      <section
        className="relative py-24 px-4 text-center bg-gradient-to-br from-primary-light via-background to-secondary-light dark:from-primary-dark/30 dark:via-background-dark dark:to-secondary-dark/30"
        data-oid="cjy5_zh"
      >
        <div
          className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-3"
          data-oid="35f32xh"
        ></div>{' '}
        {/* Optional: subtle grid pattern */}
        <div className="relative max-w-4xl mx-auto" data-oid="jlm9gnd">
          <div className="flex justify-center mb-6" data-oid="lk_t6wf">
            <Badge
              variant="primary"
              size={ageTier === 'kids' ? 'lg' : 'md'}
              className="shadow-lg"
              data-oid="r4kgnbr"
            >
              {ageTier === 'kids'
                ? '🎨 Creative Zone'
                : ageTier === 'teens_u16'
                  ? '✨ Teen Hub'
                  : ageTier === 'teens_16_plus'
                    ? '📚 Young Writers'
                    : '📖 Storytellers'}
            </Badge>
          </div>

          <h1
            className={`font-extrabold mb-6 tracking-tight ${
              ageTier === 'kids'
                ? 'text-5xl md:text-6xl' // Increased size
                : ageTier === 'teens_u16'
                  ? 'text-6xl md:text-7xl' // Increased size
                  : 'text-6xl md:text-7xl' // Increased size
            }`}
            data-oid="soc-vdd"
          >
            {content.title.includes('Wove') ? (
              <>
                {content.title.split('Wove')[0]}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark animate-pulse"
                  data-oid="kzw12i-"
                >
                  Wove
                </span>
                {content.title.split('Wove')[1]}
              </>
            ) : (
              content.title
            )}
          </h1>

          <p
            className={`mb-10 max-w-2xl mx-auto text-text-secondary dark:text-text-secondary-dark ${
              ageTier === 'kids'
                ? 'text-xl font-medium' // Increased size
                : ageTier === 'teens_u16'
                  ? 'text-2xl' // Increased size
                  : 'text-2xl' // Increased size
            }`}
            data-oid="y7xfh_d"
          >
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" data-oid="tpdm8.9">
            <Button
              onClick={handleStartStory}
              variant="primary"
              size={ageTier === 'kids' ? 'xl' : 'lg'} // Increased size
              className="min-w-[220px] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              data-oid="p:155xv"
            >
              {content.buttonText}
            </Button>

            <Tooltip content="Discover stories from our amazing community!" data-oid="cyulin:">
              <Button
                onClick={handleExploreStories}
                variant="outline"
                size={ageTier === 'kids' ? 'xl' : 'lg'} // Increased size
                className="min-w-[220px] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                data-oid="vj8_n23"
              >
                {content.exploreText}
              </Button>
            </Tooltip>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20" data-oid="wozcs8l">
            {' '}
            {/* Increased gap and margin */}
            <Card
              variant="elevated"
              hover
              className="text-center p-8 bg-surface dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              data-oid="brb53c8"
            >
              {' '}
              {/* Increased padding, rounded, shadow */}
              <div className="text-5xl mb-6 text-primary dark:text-primary-dark" data-oid="ni8p05j">
                {' '}
                {/* Increased size, color */}
                {ageTier === 'kids' ? '🎨' : '✍️'}
              </div>
              <h3
                className="text-xl font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
                data-oid="_g4us41"
              >
                {' '}
                {/* Increased size */}
                {ageTier === 'kids' ? 'Create Magic' : 'Write Stories'}
              </h3>
              <p
                className="text-md text-text-secondary dark:text-text-secondary-dark"
                data-oid="2h5_0x9"
              >
                {' '}
                {/* Increased size */}
                {ageTier === 'kids'
                  ? 'Use your imagination to create magical adventures!'
                  : 'Express your creativity through compelling narratives.'}
              </p>
            </Card>
            <Card
              variant="elevated"
              hover
              className="text-center p-6 bg-surface dark:bg-surface-dark"
              data-oid="be6_gz0"
            >
              <div className="text-4xl mb-4" data-oid="7e_.hb0">
                {ageTier === 'kids' ? '👥' : '🌍'}
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark"
                data-oid="o0lx5ul"
              >
                {ageTier === 'kids' ? 'Make Friends' : 'Connect'}
              </h3>
              <p
                className="text-sm text-text-secondary dark:text-text-secondary-dark"
                data-oid="stkmqlm"
              >
                {ageTier === 'kids'
                  ? 'Share your stories and make new friends!'
                  : 'Join a community of passionate storytellers.'}
              </p>
            </Card>
            <Card
              variant="elevated"
              hover
              className="text-center p-6 bg-surface dark:bg-surface-dark"
              data-oid="xyhvcv2"
            >
              <div className="text-4xl mb-4" data-oid=":43x_ts">
                {ageTier === 'kids' ? '🌟' : '📚'}
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark"
                data-oid="9a9gaj6"
              >
                {ageTier === 'kids' ? 'Discover Fun' : 'Explore'}
              </h3>
              <p
                className="text-sm text-text-secondary dark:text-text-secondary-dark"
                data-oid="hcdf0le"
              >
                {ageTier === 'kids'
                  ? 'Find amazing stories and fun adventures!'
                  : 'Discover diverse stories from around the world.'}
              </p>
            </Card>
          </div>

          {/* Demo Modal Button */}
          <div className="mt-12" data-oid="qoz9z6t">
            <Button onClick={() => setShowModal(true)} variant="ghost" size="sm" data-oid="e_u8ne6">
              See UI Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="UI Components Demo"
        size="lg"
        data-oid="atjo-cm"
      >
        <div className="space-y-6" data-oid="5caiae1">
          <div data-oid="cj75dq_">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="-7q:dp5"
            >
              Buttons
            </h4>
            <div className="flex flex-wrap gap-2" data-oid="-e53h7_">
              <Button variant="primary" size="sm" data-oid="43p:49f">
                Primary
              </Button>
              <Button variant="secondary" size="sm" data-oid="9wmi2h:">
                Secondary
              </Button>
              <Button variant="outline" size="sm" data-oid="w.n9piu">
                Outline
              </Button>
              <Button variant="ghost" size="sm" data-oid="rjmxu79">
                Ghost
              </Button>
            </div>
          </div>

          <div data-oid="yzkqo6t">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="r8mz:d."
            >
              Badges
            </h4>
            <div className="flex flex-wrap gap-2" data-oid="s4xd1v7">
              <Badge variant="primary" data-oid="1-bz771">
                Primary
              </Badge>
              <Badge variant="success" data-oid="2:wqqs0">
                Success
              </Badge>
              <Badge variant="warning" data-oid="op766vm">
                Warning
              </Badge>
              <Badge variant="error" data-oid="guv0l9w">
                Error
              </Badge>
              <Badge dot variant="info" data-oid="64to.l:">
                With Dot
              </Badge>
            </div>
          </div>

          <div data-oid=".m53..m">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="y.axzkl"
            >
              Cards
            </h4>
            <div className="grid grid-cols-2 gap-4" data-oid="p:qpoqt">
              <Card variant="default" padding="md" data-oid="4s8wln0">
                <p className="text-sm" data-oid="b-eiv19">
                  Default Card
                </p>
              </Card>
              <Card variant="elevated" padding="md" data-oid="o0zveiz">
                <p className="text-sm" data-oid="iz35c20">
                  Elevated Card
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
