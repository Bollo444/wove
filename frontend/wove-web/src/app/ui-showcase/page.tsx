'use client';

import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button, Card, Input, Modal, Badge, Loading, Tooltip } from '../../components/ui';

export default function UIShowcase() {
  const { currentTheme, ageTier } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: currentTheme.colors.background }}
      data-oid="mdvqh-d"
    >
      <div className="max-w-6xl mx-auto" data-oid="97awt60">
        {/* Header */}
        <div className="text-center mb-12" data-oid="ip1tz31">
          <Badge variant="primary" size="lg" className="mb-4" data-oid="lw4eyh1">
            UI Showcase - {ageTier?.replace('_', ' ').toUpperCase() || 'DEFAULT'} Theme
          </Badge>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="y_1_8mf"
          >
            Wove Design System
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.text.secondary }}
            data-oid="v5nfzn:"
          >
            Explore our age-adaptive UI components and theming system designed for all users.
          </p>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="o8b7wl-">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="f9wk3--"
          >
            Buttons
          </h2>

          <div className="space-y-6" data-oid="83cx2je">
            {/* Button Variants */}
            <div data-oid="x1l9h3v">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="nv894_5"
              >
                Variants
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="6x5pj42">
                <Button variant="primary" data-oid="zlwnpoo">
                  Primary
                </Button>
                <Button variant="secondary" data-oid="6x5wuvu">
                  Secondary
                </Button>
                <Button variant="outline" data-oid="lapgz0s">
                  Outline
                </Button>
                <Button variant="ghost" data-oid="rhvg59_">
                  Ghost
                </Button>
                <Button variant="danger" data-oid="2cr2e8i">
                  Danger
                </Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div data-oid="i56d7f1">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="fhcu14s"
              >
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-3" data-oid="ndcv1-o">
                <Button variant="primary" size="sm" data-oid="kctj2z5">
                  Small
                </Button>
                <Button variant="primary" size="md" data-oid="oq1:02y">
                  Medium
                </Button>
                <Button variant="primary" size="lg" data-oid="d38t2lw">
                  Large
                </Button>
              </div>
            </div>

            {/* Button States */}
            <div data-oid="48lo4ak">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="pt9y2oe"
              >
                States
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="dc.t0t8">
                <Button variant="primary" isLoading data-oid="5ivi9rj">
                  Loading
                </Button>
                <Button variant="primary" disabled data-oid="ymyvco8">
                  Disabled
                </Button>
                <Button variant="primary" fullWidth className="max-w-xs" data-oid="ta2ris8">
                  Full Width
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="5b-a8nk">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="c-ukzha"
          >
            Cards
          </h2>

          <div className="grid md:grid-cols-3 gap-6" data-oid="114kgy-">
            <Card variant="default" padding="md" data-oid="tzpz029">
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="twzo7_p"
              >
                Default Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="5bgbmt8"
              >
                A simple card with default styling.
              </p>
            </Card>

            <Card variant="elevated" padding="md" hover data-oid="jn_pvd2">
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="rem.7.a"
              >
                Elevated Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="9w1pf0z"
              >
                An elevated card with hover effects.
              </p>
            </Card>

            <Card
              variant="outlined"
              padding="md"
              clickable
              onClick={() => alert('Card clicked!')}
              data-oid="286u.af"
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="j6p:lzh"
              >
                Clickable Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="8712kct"
              >
                Click me to see the interaction!
              </p>
            </Card>
          </div>
        </Card>

        {/* Badges Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="p0lmupb">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="hl.k23y"
          >
            Badges
          </h2>

          <div className="space-y-4" data-oid="mm3miwx">
            <div data-oid="6kci_iv">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="v7u_749"
              >
                Variants
              </h3>
              <div className="flex flex-wrap gap-2" data-oid=":9rwsu_">
                <Badge variant="default" data-oid="tmkf5ok">
                  Default
                </Badge>
                <Badge variant="primary" data-oid="rsakc2i">
                  Primary
                </Badge>
                <Badge variant="secondary" data-oid="b75ve.b">
                  Secondary
                </Badge>
                <Badge variant="success" data-oid="cjaqzu6">
                  Success
                </Badge>
                <Badge variant="warning" data-oid="c:s-0qz">
                  Warning
                </Badge>
                <Badge variant="error" data-oid="ybu3qzp">
                  Error
                </Badge>
                <Badge variant="info" data-oid="qt-1grs">
                  Info
                </Badge>
              </div>
            </div>

            <div data-oid="76spk1u">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="wwb65kq"
              >
                With Dots
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="890uiyd">
                <Badge dot variant="success" data-oid="k2sreup">
                  Online
                </Badge>
                <Badge dot variant="warning" data-oid="hmdevv6">
                  Away
                </Badge>
                <Badge dot variant="error" data-oid="yy4.7eo">
                  Offline
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Input Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="_m0uzq_">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="izyo2_i"
          >
            Input Fields
          </h2>

          <div className="grid md:grid-cols-2 gap-6" data-oid="0ywzhm8">
            <div className="space-y-4" data-oid="xbm7vlk">
              <Input
                label="Default Input"
                placeholder="Enter some text..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                data-oid="88i:epp"
              />

              <Input
                label="With Helper Text"
                placeholder="Username"
                helperText="Choose a unique username"
                data-oid="cqjmxg-"
              />

              <Input
                label="With Error"
                placeholder="Email"
                error="Please enter a valid email address"
                data-oid="czfqpue"
              />
            </div>

            <div className="space-y-4" data-oid="oz4ey7n">
              <Input
                label="Filled Variant"
                variant="filled"
                placeholder="Search..."
                leftIcon={<span data-oid="-anz-4v">🔍</span>}
                data-oid="f2m15de"
              />

              <Input
                label="Outlined Variant"
                variant="outlined"
                placeholder="Password"
                type="password"
                rightIcon={<span data-oid="3pe2e-r">👁️</span>}
                data-oid="qm.f9y."
              />

              <Input
                label="Large Size"
                inputSize="lg"
                placeholder="Large input field"
                data-oid="t91bv3p"
              />
            </div>
          </div>
        </Card>

        {/* Loading Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="2gy0xmt">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="acsvby9"
          >
            Loading States
          </h2>

          <div className="grid md:grid-cols-2 gap-8" data-oid="pwt5rnq">
            <div className="space-y-6" data-oid="31b_ux1">
              <div data-oid="s3lyb0x">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="1:zkpwo"
                >
                  Spinner Variants
                </h3>
                <div className="flex items-center gap-6" data-oid="8hkes6u">
                  <Loading variant="spinner" size="sm" data-oid="65oa1k_" />
                  <Loading variant="spinner" size="md" data-oid="t60i4tu" />
                  <Loading variant="spinner" size="lg" data-oid="x9--6f4" />
                </div>
              </div>

              <div data-oid="i-n-vy0">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="y_-8.6i"
                >
                  Dots Variant
                </h3>
                <Loading variant="dots" text="Loading content..." data-oid="dnskf-s" />
              </div>
            </div>

            <div className="space-y-6" data-oid="9xsuey1">
              <div data-oid="8l09l2n">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="h9atrtk"
                >
                  Pulse Variant
                </h3>
                <Loading variant="pulse" size="lg" data-oid="7z.1-a5" />
              </div>

              <div data-oid="b-xuoy6">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="_ei.vot"
                >
                  Bars Variant
                </h3>
                <Loading variant="bars" text="Processing..." data-oid="7n1fjht" />
              </div>
            </div>
          </div>

          <div className="mt-6" data-oid="vjo08kp">
            <Button onClick={simulateLoading} disabled={isLoading} data-oid="wh.g355">
              {isLoading ? 'Loading...' : 'Test Full Screen Loading'}
            </Button>
          </div>
        </Card>

        {/* Tooltips Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="kp9rfc7">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="argrn8i"
          >
            Tooltips
          </h2>

          <div className="flex flex-wrap gap-4" data-oid="_.uv6fh">
            <Tooltip content="This tooltip appears on top" position="top" data-oid="n35y_v_">
              <Button variant="outline" data-oid="d6kjvro">
                Hover me (Top)
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip appears on the right"
              position="right"
              data-oid="vbxun.k"
            >
              <Button variant="outline" data-oid="aw9s2zl">
                Hover me (Right)
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip appears on the bottom"
              position="bottom"
              data-oid="_pwhb6s"
            >
              <Button variant="outline" data-oid="gnnb8.x">
                Hover me (Bottom)
              </Button>
            </Tooltip>

            <Tooltip content="This tooltip appears on the left" position="left" data-oid="c6z4f9m">
              <Button variant="outline" data-oid="_ksqjl7">
                Hover me (Left)
              </Button>
            </Tooltip>

            <Tooltip
              content="Click to toggle this tooltip"
              trigger="click"
              position="top"
              data-oid="g4e:t23"
            >
              <Button variant="secondary" data-oid="jgvwo:.">
                Click me
              </Button>
            </Tooltip>
          </div>
        </Card>

        {/* Modal Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="i73.ps5">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid=".fvmq2z"
          >
            Modals
          </h2>

          <Button onClick={() => setShowModal(true)} variant="primary" data-oid="ilp:_6a">
            Open Modal Demo
          </Button>
        </Card>

        {/* Age-Specific Features */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="0cf4s2q">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="go1plji"
          >
            Age-Specific Features
          </h2>

          <div className="space-y-4" data-oid="5r.5w0k">
            <div data-oid="214y_mo">
              <h3
                className="text-lg font-medium mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="tdshab."
              >
                Current Age Tier: {ageTier?.replace('_', ' ').toUpperCase() || 'DEFAULT'}
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="c6h69fz"
              >
                {ageTier === 'kids' &&
                  'Enhanced animations, larger buttons, playful design elements'}
                {ageTier === 'teens_u16' && 'Modern animations, balanced sizing, vibrant colors'}
                {ageTier === 'teens_16_plus' &&
                  'Refined interactions, clean design, sophisticated styling'}
                {ageTier === 'adults' &&
                  'Minimal animations, compact sizing, professional appearance'}
                {!ageTier && 'Default theme with standard styling'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4" data-oid="gri5:si">
              <div data-oid="esinpb5">
                <h4
                  className="font-medium mb-2"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="smfp.bf"
                >
                  Theme Colors
                </h4>
                <div className="flex gap-2" data-oid="kr89xtf">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                    title="Primary"
                    data-oid="rzc:f0j"
                  />

                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                    title="Secondary"
                    data-oid="m:cfogy"
                  />

                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.colors.surface }}
                    title="Surface"
                    data-oid="gwcs.kp"
                  />

                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.colors.background }}
                    title="Background"
                    data-oid="-vqe2l:"
                  />
                </div>
              </div>

              <div data-oid="-m40apb">
                <h4
                  className="font-medium mb-2"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="dplq_0v"
                >
                  Interactive Elements
                </h4>
                <p
                  className="text-sm"
                  style={{ color: currentTheme.colors.text.secondary }}
                  data-oid="iit-ayf"
                >
                  Button size:{' '}
                  {ageTier === 'kids'
                    ? 'Large'
                    : ageTier === 'teens_u16'
                      ? 'Medium-Large'
                      : 'Standard'}
                  <br data-oid="xo7jwyf" />
                  Animation style:{' '}
                  {ageTier === 'kids' ? 'Playful' : ageTier === 'teens_u16' ? 'Smooth' : 'Subtle'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Demo Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal Demo"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)} data-oid="-u571r5">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)} data-oid=":d4ep:o">
              Confirm
            </Button>
          </>
        }
        data-oid="peods6m"
      >
        <div className="space-y-4" data-oid="qkl6ejr">
          <p style={{ color: currentTheme.colors.text.primary }} data-oid="z9snfj6">
            This is a demo modal showcasing the modal component with age-appropriate styling.
          </p>

          <Input label="Sample Input" placeholder="Type something..." data-oid="1l2wtr2" />

          <div className="flex gap-2" data-oid="ec.w5:7">
            <Badge variant="info" data-oid="aqqm63p">
              Modal Content
            </Badge>
            <Badge variant="success" data-oid="lglnmw9">
              Interactive
            </Badge>
          </div>
        </div>
      </Modal>

      {/* Full Screen Loading */}
      {isLoading && (
        <Loading
          fullScreen
          size="xl"
          variant={ageTier === 'kids' ? 'dots' : 'spinner'}
          text={ageTier === 'kids' ? 'Creating something magical...' : 'Loading...'}
          data-oid="td:dtc5"
        />
      )}
    </div>
  );
}
