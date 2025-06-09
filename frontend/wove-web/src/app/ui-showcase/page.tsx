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
      data-oid="rhpjiy4"
    >
      <div className="max-w-6xl mx-auto" data-oid="9mn0gj8">
        {/* Header */}
        <div className="text-center mb-12" data-oid="sfqifo9">
          <Badge variant="primary" size="lg" className="mb-4" data-oid="ir.zbz6">
            UI Showcase - {ageTier?.replace('_', ' ').toUpperCase() || 'DEFAULT'} Theme
          </Badge>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="xrv3e3_"
          >
            Wove Design System
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.text.secondary }}
            data-oid="qbh5d43"
          >
            Explore our age-adaptive UI components and theming system designed for all users.
          </p>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="-gxgeb7">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="60d52q8"
          >
            Buttons
          </h2>

          <div className="space-y-6" data-oid="1t7w3-c">
            {/* Button Variants */}
            <div data-oid="m.q58tw">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="0bi5vi:"
              >
                Variants
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="3g1yl8b">
                <Button variant="primary" data-oid="o:jof51">
                  Primary
                </Button>
                <Button variant="secondary" data-oid="z5ddq4q">
                  Secondary
                </Button>
                <Button variant="outline" data-oid="wiu4umg">
                  Outline
                </Button>
                <Button variant="ghost" data-oid="7qgir7z">
                  Ghost
                </Button>
                <Button variant="danger" data-oid="hh7g:ly">
                  Danger
                </Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div data-oid="9x3cbuq">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="g3qsy0l"
              >
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-3" data-oid="hhhb0zb">
                <Button variant="primary" size="sm" data-oid="1c::7qe">
                  Small
                </Button>
                <Button variant="primary" size="md" data-oid="k_a7n_h">
                  Medium
                </Button>
                <Button variant="primary" size="lg" data-oid="21ygxyp">
                  Large
                </Button>
              </div>
            </div>

            {/* Button States */}
            <div data-oid="ky4z7.m">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="pe9mwmt"
              >
                States
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="mr5l-vr">
                <Button variant="primary" isLoading data-oid="j:8j5lj">
                  Loading
                </Button>
                <Button variant="primary" disabled data-oid="vj5k5ux">
                  Disabled
                </Button>
                <Button variant="primary" fullWidth className="max-w-xs" data-oid="66x6018">
                  Full Width
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="61kd4nw">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="ow8:qa4"
          >
            Cards
          </h2>

          <div className="grid md:grid-cols-3 gap-6" data-oid="phpfs36">
            <Card variant="default" padding="md" data-oid="qior0f8">
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="s_i_z-8"
              >
                Default Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="v6srlc1"
              >
                A simple card with default styling.
              </p>
            </Card>

            <Card variant="elevated" padding="md" hover data-oid="o0:etwk">
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="ti-p4pe"
              >
                Elevated Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="ldvp.0z"
              >
                An elevated card with hover effects.
              </p>
            </Card>

            <Card
              variant="outlined"
              padding="md"
              clickable
              onClick={() => alert('Card clicked!')}
              data-oid="ht3j9tj"
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="rt_5.11"
              >
                Clickable Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="b36h9rp"
              >
                Click me to see the interaction!
              </p>
            </Card>
          </div>
        </Card>

        {/* Badges Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="lo.m6g_">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="yg1d3dy"
          >
            Badges
          </h2>

          <div className="space-y-4" data-oid="mjlxuen">
            <div data-oid="61n048i">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="4jlog1b"
              >
                Variants
              </h3>
              <div className="flex flex-wrap gap-2" data-oid="22hou:f">
                <Badge variant="default" data-oid="prj8dgt">
                  Default
                </Badge>
                <Badge variant="primary" data-oid="cuklr3-">
                  Primary
                </Badge>
                <Badge variant="secondary" data-oid="cnh1c:-">
                  Secondary
                </Badge>
                <Badge variant="success" data-oid="o1p1ojb">
                  Success
                </Badge>
                <Badge variant="warning" data-oid="2m9ob3o">
                  Warning
                </Badge>
                <Badge variant="error" data-oid="9u5j-rn">
                  Error
                </Badge>
                <Badge variant="info" data-oid="yviyrgz">
                  Info
                </Badge>
              </div>
            </div>

            <div data-oid="ob7ibw3">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="3-_idr8"
              >
                With Dots
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="7imxmbk">
                <Badge dot variant="success" data-oid="-y1ozoc">
                  Online
                </Badge>
                <Badge dot variant="warning" data-oid="f96eq__">
                  Away
                </Badge>
                <Badge dot variant="error" data-oid="fn4b6ne">
                  Offline
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Input Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="wfa:7h5">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="lskaks5"
          >
            Input Fields
          </h2>

          <div className="grid md:grid-cols-2 gap-6" data-oid="p7ttagu">
            <div className="space-y-4" data-oid="s.teuem">
              <Input
                label="Default Input"
                placeholder="Enter some text..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                data-oid="hq_uepq"
              />

              <Input
                label="With Helper Text"
                placeholder="Username"
                helperText="Choose a unique username"
                data-oid="79hjsaq"
              />

              <Input
                label="With Error"
                placeholder="Email"
                error="Please enter a valid email address"
                data-oid="p3wosjb"
              />
            </div>

            <div className="space-y-4" data-oid="aneem:x">
              <Input
                label="Filled Variant"
                variant="filled"
                placeholder="Search..."
                leftIcon={<span data-oid="zucu0_i">🔍</span>}
                data-oid="hig1.m-"
              />

              <Input
                label="Outlined Variant"
                variant="outlined"
                placeholder="Password"
                type="password"
                rightIcon={<span data-oid=".-:rhua">👁️</span>}
                data-oid="fi_t80y"
              />

              <Input
                label="Large Size"
                inputSize="lg"
                placeholder="Large input field"
                data-oid="b1kiox5"
              />
            </div>
          </div>
        </Card>

        {/* Loading Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="la36ol9">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="86e:lzv"
          >
            Loading States
          </h2>

          <div className="grid md:grid-cols-2 gap-8" data-oid="ubefkwa">
            <div className="space-y-6" data-oid="y198r0g">
              <div data-oid="s4gftb0">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="._.x68_"
                >
                  Spinner Variants
                </h3>
                <div className="flex items-center gap-6" data-oid="m0igb:m">
                  <Loading variant="spinner" size="sm" data-oid="muzfbmu" />
                  <Loading variant="spinner" size="md" data-oid="gn30nh_" />
                  <Loading variant="spinner" size="lg" data-oid="e26g4xv" />
                </div>
              </div>

              <div data-oid="cysp3am">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="uqel2t0"
                >
                  Dots Variant
                </h3>
                <Loading variant="dots" text="Loading content..." data-oid="4jzr:gc" />
              </div>
            </div>

            <div className="space-y-6" data-oid="xmb7s2t">
              <div data-oid=":9g7_vc">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="4.v7kt9"
                >
                  Pulse Variant
                </h3>
                <Loading variant="pulse" size="lg" data-oid="s5vdp89" />
              </div>

              <div data-oid="86-0zda">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="y0zex85"
                >
                  Bars Variant
                </h3>
                <Loading variant="bars" text="Processing..." data-oid="rwxe65w" />
              </div>
            </div>
          </div>

          <div className="mt-6" data-oid="jqz.7pb">
            <Button onClick={simulateLoading} disabled={isLoading} data-oid="0_rrmaf">
              {isLoading ? 'Loading...' : 'Test Full Screen Loading'}
            </Button>
          </div>
        </Card>

        {/* Tooltips Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="e4yl3qk">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid=".f6hdx1"
          >
            Tooltips
          </h2>

          <div className="flex flex-wrap gap-4" data-oid="j:a49tp">
            <Tooltip content="This tooltip appears on top" position="top" data-oid="4.fyaqr">
              <Button variant="outline" data-oid="d7z5a2.">
                Hover me (Top)
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip appears on the right"
              position="right"
              data-oid="43ypmdl"
            >
              <Button variant="outline" data-oid="mryc1lk">
                Hover me (Right)
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip appears on the bottom"
              position="bottom"
              data-oid="3ytyimc"
            >
              <Button variant="outline" data-oid="_ozmwuf">
                Hover me (Bottom)
              </Button>
            </Tooltip>

            <Tooltip content="This tooltip appears on the left" position="left" data-oid="tw8sy75">
              <Button variant="outline" data-oid="s4e:f9r">
                Hover me (Left)
              </Button>
            </Tooltip>

            <Tooltip
              content="Click to toggle this tooltip"
              trigger="click"
              position="top"
              data-oid="o_p3-xx"
            >
              <Button variant="secondary" data-oid="2-gnq0c">
                Click me
              </Button>
            </Tooltip>
          </div>
        </Card>

        {/* Modal Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="4jmortl">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="2pehp.c"
          >
            Modals
          </h2>

          <Button onClick={() => setShowModal(true)} variant="primary" data-oid="_r.f.-d">
            Open Modal Demo
          </Button>
        </Card>

        {/* Age-Specific Features */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="9hgd-3k">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="v_05cc7"
          >
            Age-Specific Features
          </h2>

          <div className="space-y-4" data-oid="okj50ya">
            <div data-oid=".5p0edg">
              <h3
                className="text-lg font-medium mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="poluv4m"
              >
                Current Age Tier: {ageTier?.replace('_', ' ').toUpperCase() || 'DEFAULT'}
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="g.l_8mt"
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

            <div className="grid md:grid-cols-2 gap-4" data-oid="9usb4l_">
              <div data-oid="oh0ay-s">
                <h4
                  className="font-medium mb-2"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="2u6aczi"
                >
                  Theme Colors
                </h4>
                <div className="flex gap-2" data-oid=".tzg6qa">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                    title="Primary"
                    data-oid="2:0flmi"
                  />

                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                    title="Secondary"
                    data-oid="cph7:rl"
                  />

                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.colors.surface }}
                    title="Surface"
                    data-oid="_frgbfx"
                  />

                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.colors.background }}
                    title="Background"
                    data-oid="0uju6l4"
                  />
                </div>
              </div>

              <div data-oid="tuw0-ee">
                <h4
                  className="font-medium mb-2"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid=".5i_5ds"
                >
                  Interactive Elements
                </h4>
                <p
                  className="text-sm"
                  style={{ color: currentTheme.colors.text.secondary }}
                  data-oid="allrt48"
                >
                  Button size:{' '}
                  {ageTier === 'kids'
                    ? 'Large'
                    : ageTier === 'teens_u16'
                      ? 'Medium-Large'
                      : 'Standard'}
                  <br data-oid="_iowch_" />
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
            <Button variant="ghost" onClick={() => setShowModal(false)} data-oid=".bufhro">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)} data-oid="7y-u9--">
              Confirm
            </Button>
          </>
        }
        data-oid="l._07dh"
      >
        <div className="space-y-4" data-oid="jfbc35i">
          <p style={{ color: currentTheme.colors.text.primary }} data-oid="nwiwmop">
            This is a demo modal showcasing the modal component with age-appropriate styling.
          </p>

          <Input label="Sample Input" placeholder="Type something..." data-oid="11c4p:w" />

          <div className="flex gap-2" data-oid="y0q3tmk">
            <Badge variant="info" data-oid="dlvvzfe">
              Modal Content
            </Badge>
            <Badge variant="success" data-oid="82iuhrx">
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
          data-oid="9bcqaj9"
        />
      )}
    </div>
  );
}
