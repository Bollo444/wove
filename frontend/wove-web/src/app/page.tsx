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
        data-oid="_ieh6cl"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-text-primary dark:bg-background-dark dark:text-text-primary-dark transition-colors duration-300"
      data-oid="u3qn3bm"
    >
      {/* Hero Section */}
      <section
        className="relative py-24 px-4 text-center bg-gradient-to-br from-primary-light via-background to-secondary-light dark:from-primary-dark/30 dark:via-background-dark dark:to-secondary-dark/30"
        data-oid="o6a8-l9"
      >
        <div
          className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-3"
          data-oid="tjk39vd"
        ></div>{' '}
        {/* Optional: subtle grid pattern */}
        <div className="relative max-w-4xl mx-auto" data-oid="csig_kr">
          <div className="flex justify-center mb-6" data-oid="y4zp6p6">
            <Badge
              variant="primary"
              size={ageTier === 'kids' ? 'lg' : 'md'}
              className="shadow-lg"
              data-oid=".ovuj3i"
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
            data-oid="npnkv3z"
          >
            {content.title.includes('Wove') ? (
              <>
                {content.title.split('Wove')[0]}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark animate-pulse"
                  data-oid="qf-:i1u"
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
            data-oid="h_nqbx9"
          >
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" data-oid="pj8a_nh">
            <Button
              onClick={handleStartStory}
              variant="primary"
              size={ageTier === 'kids' ? 'xl' : 'lg'} // Increased size
              className="min-w-[220px] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              data-oid="c:8sgge"
            >
              {content.buttonText}
            </Button>

            <Tooltip content="Discover stories from our amazing community!" data-oid="n6_:mkj">
              <Button
                onClick={handleExploreStories}
                variant="outline"
                size={ageTier === 'kids' ? 'xl' : 'lg'} // Increased size
                className="min-w-[220px] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                data-oid="ga.q3tb"
              >
                {content.exploreText}
              </Button>
            </Tooltip>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20" data-oid=":tni1ne">
            {' '}
            {/* Increased gap and margin */}
            <Card
              variant="elevated"
              hover
              className="text-center p-8 bg-surface dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              data-oid="-0xwinn"
            >
              {' '}
              {/* Increased padding, rounded, shadow */}
              <div className="text-5xl mb-6 text-primary dark:text-primary-dark" data-oid="pje-3y0">
                {' '}
                {/* Increased size, color */}
                {ageTier === 'kids' ? '🎨' : '✍️'}
              </div>
              <h3
                className="text-xl font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
                data-oid="epas2o3"
              >
                {' '}
                {/* Increased size */}
                {ageTier === 'kids' ? 'Create Magic' : 'Write Stories'}
              </h3>
              <p
                className="text-md text-text-secondary dark:text-text-secondary-dark"
                data-oid="-r:m6su"
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
              data-oid="kaob19n"
            >
              <div className="text-4xl mb-4" data-oid="n.:_i.g">
                {ageTier === 'kids' ? '👥' : '🌍'}
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark"
                data-oid="xr:6ty_"
              >
                {ageTier === 'kids' ? 'Make Friends' : 'Connect'}
              </h3>
              <p
                className="text-sm text-text-secondary dark:text-text-secondary-dark"
                data-oid="66rlc::"
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
              data-oid="fbkxkq5"
            >
              <div className="text-4xl mb-4" data-oid="y.wrw-1">
                {ageTier === 'kids' ? '🌟' : '📚'}
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark"
                data-oid="vnqy776"
              >
                {ageTier === 'kids' ? 'Discover Fun' : 'Explore'}
              </h3>
              <p
                className="text-sm text-text-secondary dark:text-text-secondary-dark"
                data-oid="cr91hil"
              >
                {ageTier === 'kids'
                  ? 'Find amazing stories and fun adventures!'
                  : 'Discover diverse stories from around the world.'}
              </p>
            </Card>
          </div>

          {/* Demo Modal Button */}
          <div className="mt-12" data-oid="00s-zoh">
            <Button onClick={() => setShowModal(true)} variant="ghost" size="sm" data-oid="u1bd6_d">
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
        data-oid="emfi0u5"
      >
        <div className="space-y-6" data-oid="sw8ki.y">
          <div data-oid="53are9:">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="n5ef5v5"
            >
              Buttons
            </h4>
            <div className="flex flex-wrap gap-2" data-oid="nuwvf-i">
              <Button variant="primary" size="sm" data-oid=".8kfa6-">
                Primary
              </Button>
              <Button variant="secondary" size="sm" data-oid="o1k9.t_">
                Secondary
              </Button>
              <Button variant="outline" size="sm" data-oid="zlwjo-d">
                Outline
              </Button>
              <Button variant="ghost" size="sm" data-oid="x:ii-2-">
                Ghost
              </Button>
            </div>
          </div>

          <div data-oid="-u6tpuo">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="1nk9k3r"
            >
              Badges
            </h4>
            <div className="flex flex-wrap gap-2" data-oid="nkr-6zh">
              <Badge variant="primary" data-oid="fj8s9cv">
                Primary
              </Badge>
              <Badge variant="success" data-oid="so:n1y:">
                Success
              </Badge>
              <Badge variant="warning" data-oid="9wc6dn.">
                Warning
              </Badge>
              <Badge variant="error" data-oid="uxiom3l">
                Error
              </Badge>
              <Badge dot variant="info" data-oid="3ybqyag">
                With Dot
              </Badge>
            </div>
          </div>

          <div data-oid="k48cx7_">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="dda:.7n"
            >
              Cards
            </h4>
            <div className="grid grid-cols-2 gap-4" data-oid="p:js7b.">
              <Card variant="default" padding="md" data-oid="bb8:h4b">
                <p className="text-sm" data-oid="pez.:39">
                  Default Card
                </p>
              </Card>
              <Card variant="elevated" padding="md" data-oid="w9t1e-a">
                <p className="text-sm" data-oid="bvs601w">
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
