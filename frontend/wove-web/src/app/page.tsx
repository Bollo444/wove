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
        data-oid="363z4fc"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-text-primary dark:bg-background-dark dark:text-text-primary-dark transition-colors duration-300"
      data-oid="w8vo30m"
    >
      {/* Hero Section */}
      <section
        className="relative py-24 px-4 text-center bg-gradient-to-br from-primary-light via-background to-secondary-light dark:from-primary-dark/30 dark:via-background-dark dark:to-secondary-dark/30"
        data-oid="kqmm0vq"
      >
        <div
          className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-3"
          data-oid="biq_93e"
        ></div>{' '}
        {/* Optional: subtle grid pattern */}
        <div className="relative max-w-4xl mx-auto" data-oid="vsna62e">
          <div className="flex justify-center mb-6" data-oid="o8-z6rm">
            <Badge
              variant="primary"
              size={ageTier === 'kids' ? 'lg' : 'md'}
              className="shadow-lg"
              data-oid="398fm.s"
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
            data-oid="bw3k.e0"
          >
            {content.title.includes('Wove') ? (
              <>
                {content.title.split('Wove')[0]}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark animate-pulse"
                  data-oid="i_72di5"
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
            data-oid=".5rnnph"
          >
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" data-oid="230mzan">
            <Button
              onClick={handleStartStory}
              variant="primary"
              size={ageTier === 'kids' ? 'xl' : 'lg'} // Increased size
              className="min-w-[220px] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              data-oid="7dlhfyz"
            >
              {content.buttonText}
            </Button>

            <Tooltip content="Discover stories from our amazing community!" data-oid=":2wxgz6">
              <Button
                onClick={handleExploreStories}
                variant="outline"
                size={ageTier === 'kids' ? 'xl' : 'lg'} // Increased size
                className="min-w-[220px] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                data-oid="tbp566n"
              >
                {content.exploreText}
              </Button>
            </Tooltip>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20" data-oid="6twtl8j">
            {' '}
            {/* Increased gap and margin */}
            <Card
              variant="elevated"
              hover
              className="text-center p-8 bg-surface dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              data-oid="shcj7w9"
            >
              {' '}
              {/* Increased padding, rounded, shadow */}
              <div className="text-5xl mb-6 text-primary dark:text-primary-dark" data-oid="v:m5zf.">
                {' '}
                {/* Increased size, color */}
                {ageTier === 'kids' ? '🎨' : '✍️'}
              </div>
              <h3
                className="text-xl font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
                data-oid="okdu:ev"
              >
                {' '}
                {/* Increased size */}
                {ageTier === 'kids' ? 'Create Magic' : 'Write Stories'}
              </h3>
              <p
                className="text-md text-text-secondary dark:text-text-secondary-dark"
                data-oid="lc:.dx7"
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
              data-oid="_qf3n77"
            >
              <div className="text-4xl mb-4" data-oid="f_fgxvn">
                {ageTier === 'kids' ? '👥' : '🌍'}
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark"
                data-oid="ttdm04."
              >
                {ageTier === 'kids' ? 'Make Friends' : 'Connect'}
              </h3>
              <p
                className="text-sm text-text-secondary dark:text-text-secondary-dark"
                data-oid="zreg0c3"
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
              data-oid="rxjchx:"
            >
              <div className="text-4xl mb-4" data-oid="_qqhtik">
                {ageTier === 'kids' ? '🌟' : '📚'}
              </div>
              <h3
                className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark"
                data-oid="1r217vp"
              >
                {ageTier === 'kids' ? 'Discover Fun' : 'Explore'}
              </h3>
              <p
                className="text-sm text-text-secondary dark:text-text-secondary-dark"
                data-oid="2_0ncvp"
              >
                {ageTier === 'kids'
                  ? 'Find amazing stories and fun adventures!'
                  : 'Discover diverse stories from around the world.'}
              </p>
            </Card>
          </div>

          {/* Demo Modal Button */}
          <div className="mt-12" data-oid="k.5zy9n">
            <Button onClick={() => setShowModal(true)} variant="ghost" size="sm" data-oid="hrgvwpl">
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
        data-oid="rwvt_8w"
      >
        <div className="space-y-6" data-oid="55s2jez">
          <div data-oid="ijkdz-l">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="eelbiqu"
            >
              Buttons
            </h4>
            <div className="flex flex-wrap gap-2" data-oid="h._nmom">
              <Button variant="primary" size="sm" data-oid="r9u7tbt">
                Primary
              </Button>
              <Button variant="secondary" size="sm" data-oid="clri9xq">
                Secondary
              </Button>
              <Button variant="outline" size="sm" data-oid="z1lpi6k">
                Outline
              </Button>
              <Button variant="ghost" size="sm" data-oid="cb5ixh-">
                Ghost
              </Button>
            </div>
          </div>

          <div data-oid="zg0cgab">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="2:7:ohi"
            >
              Badges
            </h4>
            <div className="flex flex-wrap gap-2" data-oid="b.p5atw">
              <Badge variant="primary" data-oid="3yvl9a.">
                Primary
              </Badge>
              <Badge variant="success" data-oid="_km0ikg">
                Success
              </Badge>
              <Badge variant="warning" data-oid="7nxzh9t">
                Warning
              </Badge>
              <Badge variant="error" data-oid="0kw9x-9">
                Error
              </Badge>
              <Badge dot variant="info" data-oid="bzpc:o5">
                With Dot
              </Badge>
            </div>
          </div>

          <div data-oid="neghxt0">
            <h4
              className="font-semibold mb-3 text-text-primary dark:text-text-primary-dark"
              data-oid="t-xpse-"
            >
              Cards
            </h4>
            <div className="grid grid-cols-2 gap-4" data-oid="245r49o">
              <Card variant="default" padding="md" data-oid=":ykv6rh">
                <p className="text-sm" data-oid="en5cjbm">
                  Default Card
                </p>
              </Card>
              <Card variant="elevated" padding="md" data-oid="lhpmfp6">
                <p className="text-sm" data-oid="kghsi6t">
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
