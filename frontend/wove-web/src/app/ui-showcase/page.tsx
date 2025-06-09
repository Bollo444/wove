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
      data-oid="zrjpca2"
    >
      <div className="max-w-6xl mx-auto" data-oid="z.fetr.">
        {/* Header */}
        <div className="text-center mb-12" data-oid="5dfs8aw">
          <Badge variant="primary" size="lg" className="mb-4" data-oid="1wfbprc">
            UI Showcase - {ageTier?.replace('_', ' ').toUpperCase() || 'DEFAULT'} Theme
          </Badge>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="lx-tm3e"
          >
            Wove Design System
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.text.secondary }}
            data-oid="75e1kw9"
          >
            Explore our age-adaptive UI components and theming system designed for all users.
          </p>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="vrc4o7v">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="k36pc0k"
          >
            Buttons
          </h2>

          <div className="space-y-6" data-oid="eqjtjy-">
            {/* Button Variants */}
            <div data-oid=".x15xj4">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="jzt:1kx"
              >
                Variants
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="6ze0nm2">
                <Button variant="primary" data-oid="svu13j3">
                  Primary
                </Button>
                <Button variant="secondary" data-oid="qmt3177">
                  Secondary
                </Button>
                <Button variant="outline" data-oid="etgp2ia">
                  Outline
                </Button>
                <Button variant="ghost" data-oid="6obmn32">
                  Ghost
                </Button>
                <Button variant="danger" data-oid="77owg.d">
                  Danger
                </Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div data-oid=".jxs9lu">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="46yqtf5"
              >
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-3" data-oid="9j:eoxs">
                <Button variant="primary" size="sm" data-oid="d48x2_e">
                  Small
                </Button>
                <Button variant="primary" size="md" data-oid="-mzn.3b">
                  Medium
                </Button>
                <Button variant="primary" size="lg" data-oid="2byaogs">
                  Large
                </Button>
              </div>
            </div>

            {/* Button States */}
            <div data-oid="s:ykhz0">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="2um0pyw"
              >
                States
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="ht1g5j9">
                <Button variant="primary" isLoading data-oid="k6.np4e">
                  Loading
                </Button>
                <Button variant="primary" disabled data-oid="dpv0ky2">
                  Disabled
                </Button>
                <Button variant="primary" fullWidth className="max-w-xs" data-oid="_09jzpf">
                  Full Width
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="-dqhtgk">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="wt2vuwf"
          >
            Cards
          </h2>

          <div className="grid md:grid-cols-3 gap-6" data-oid="56mwt4z">
            <Card variant="default" padding="md" data-oid="wjefw6l">
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="p6_0wtg"
              >
                Default Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="ax_:.0g"
              >
                A simple card with default styling.
              </p>
            </Card>

            <Card variant="elevated" padding="md" hover data-oid=":-nagii">
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="1o.m4k9"
              >
                Elevated Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="4ahfkn8"
              >
                An elevated card with hover effects.
              </p>
            </Card>

            <Card
              variant="outlined"
              padding="md"
              clickable
              onClick={() => alert('Card clicked!')}
              data-oid="1wbhtc1"
            >
              <h3
                className="font-semibold mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="3cu9hhc"
              >
                Clickable Card
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="_p5jmkh"
              >
                Click me to see the interaction!
              </p>
            </Card>
          </div>
        </Card>

        {/* Badges Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="z60j4ed">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="ym_t.dv"
          >
            Badges
          </h2>

          <div className="space-y-4" data-oid="2x._rw5">
            <div data-oid="::iu9v:">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="c0h0azb"
              >
                Variants
              </h3>
              <div className="flex flex-wrap gap-2" data-oid="r72o2pb">
                <Badge variant="default" data-oid="2:xg654">
                  Default
                </Badge>
                <Badge variant="primary" data-oid="f:.37tc">
                  Primary
                </Badge>
                <Badge variant="secondary" data-oid="hhyw9n1">
                  Secondary
                </Badge>
                <Badge variant="success" data-oid="o.y8zw3">
                  Success
                </Badge>
                <Badge variant="warning" data-oid="iey75:h">
                  Warning
                </Badge>
                <Badge variant="error" data-oid="0-tp7g4">
                  Error
                </Badge>
                <Badge variant="info" data-oid="8r4zgq1">
                  Info
                </Badge>
              </div>
            </div>

            <div data-oid="2mi_590">
              <h3
                className="text-lg font-medium mb-3"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid="2f95ads"
              >
                With Dots
              </h3>
              <div className="flex flex-wrap gap-3" data-oid="kp4znw:">
                <Badge dot variant="success" data-oid=".c7n0vn">
                  Online
                </Badge>
                <Badge dot variant="warning" data-oid="aqypqh2">
                  Away
                </Badge>
                <Badge dot variant="error" data-oid="8tjb-7e">
                  Offline
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Input Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="u35uspp">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="lcgm8p."
          >
            Input Fields
          </h2>

          <div className="grid md:grid-cols-2 gap-6" data-oid="pzp8zlw">
            <div className="space-y-4" data-oid="zkbjejj">
              <Input
                label="Default Input"
                placeholder="Enter some text..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                data-oid="ecgq.29"
              />

              <Input
                label="With Helper Text"
                placeholder="Username"
                helperText="Choose a unique username"
                data-oid="kg2wo9d"
              />

              <Input
                label="With Error"
                placeholder="Email"
                error="Please enter a valid email address"
                data-oid="dxei74a"
              />
            </div>

            <div className="space-y-4" data-oid="_xk3txw">
              <Input
                label="Filled Variant"
                variant="filled"
                placeholder="Search..."
                leftIcon={<span data-oid="0a1os9r">🔍</span>}
                data-oid="dz.h-l9"
              />

              <Input
                label="Outlined Variant"
                variant="outlined"
                placeholder="Password"
                type="password"
                rightIcon={<span data-oid="-g.yezf">👁️</span>}
                data-oid="z.:wylb"
              />

              <Input
                label="Large Size"
                inputSize="lg"
                placeholder="Large input field"
                data-oid="sk6omz8"
              />
            </div>
          </div>
        </Card>

        {/* Loading Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid=":a9mudy">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="baozzm_"
          >
            Loading States
          </h2>

          <div className="grid md:grid-cols-2 gap-8" data-oid="ywsbs9r">
            <div className="space-y-6" data-oid="afqip91">
              <div data-oid="yualacz">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="1p2gnf-"
                >
                  Spinner Variants
                </h3>
                <div className="flex items-center gap-6" data-oid="d58o45c">
                  <Loading variant="spinner" size="sm" data-oid="dt3yef." />
                  <Loading variant="spinner" size="md" data-oid="s6_ds5e" />
                  <Loading variant="spinner" size="lg" data-oid="4a9wmo9" />
                </div>
              </div>

              <div data-oid="7mwgzpc">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="1xcma64"
                >
                  Dots Variant
                </h3>
                <Loading variant="dots" text="Loading content..." data-oid="d9x9cz3" />
              </div>
            </div>

            <div className="space-y-6" data-oid="ij43r.i">
              <div data-oid="7_09j7.">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="zsduer."
                >
                  Pulse Variant
                </h3>
                <Loading variant="pulse" size="lg" data-oid="wmjxqux" />
              </div>

              <div data-oid="jf0sjut">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid=".f-b3cy"
                >
                  Bars Variant
                </h3>
                <Loading variant="bars" text="Processing..." data-oid="pelt8dx" />
              </div>
            </div>
          </div>

          <div className="mt-6" data-oid="0z4:-fs">
            <Button onClick={simulateLoading} disabled={isLoading} data-oid="69j1h:s">
              {isLoading ? 'Loading...' : 'Test Full Screen Loading'}
            </Button>
          </div>
        </Card>

        {/* Tooltips Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="em9wk88">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="iv.j7c2"
          >
            Tooltips
          </h2>

          <div className="flex flex-wrap gap-4" data-oid="wft7m-s">
            <Tooltip content="This tooltip appears on top" position="top" data-oid="qu6ix35">
              <Button variant="outline" data-oid="q9c9o9q">
                Hover me (Top)
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip appears on the right"
              position="right"
              data-oid="t4pev6q"
            >
              <Button variant="outline" data-oid="d2lut1i">
                Hover me (Right)
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip appears on the bottom"
              position="bottom"
              data-oid="ujftcxo"
            >
              <Button variant="outline" data-oid="6z_1uql">
                Hover me (Bottom)
              </Button>
            </Tooltip>

            <Tooltip content="This tooltip appears on the left" position="left" data-oid="0m0m3x-">
              <Button variant="outline" data-oid="om4mnlr">
                Hover me (Left)
              </Button>
            </Tooltip>

            <Tooltip
              content="Click to toggle this tooltip"
              trigger="click"
              position="top"
              data-oid="f.aantj"
            >
              <Button variant="secondary" data-oid="vgn_-hh">
                Click me
              </Button>
            </Tooltip>
          </div>
        </Card>

        {/* Modal Section */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="tpnbzgv">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid="wcdhgey"
          >
            Modals
          </h2>

          <Button onClick={() => setShowModal(true)} variant="primary" data-oid="xmhf3f7">
            Open Modal Demo
          </Button>
        </Card>

        {/* Age-Specific Features */}
        <Card variant="elevated" className="mb-8 p-6" data-oid="fmrcyf8">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ color: currentTheme.colors.text.primary }}
            data-oid=":bnb771"
          >
            Age-Specific Features
          </h2>

          <div className="space-y-4" data-oid="mqf614.">
            <div data-oid="8cese0e">
              <h3
                className="text-lg font-medium mb-2"
                style={{ color: currentTheme.colors.text.primary }}
                data-oid=":d9:t5n"
              >
                Current Age Tier: {ageTier?.replace('_', ' ').toUpperCase() || 'DEFAULT'}
              </h3>
              <p
                className="text-sm"
                style={{ color: currentTheme.colors.text.secondary }}
                data-oid="nw8:7gt"
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

            <div className="grid md:grid-cols-2 gap-4" data-oid="0yi00it">
              <div data-oid="ep:zwdh">
                <h4
                  className="font-medium mb-2"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="xpa1zx7"
                >
                  Theme Colors
                </h4>
                <div className="flex gap-2" data-oid="t.b0j9p">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                    title="Primary"
                    data-oid=".2-0d.m"
                  />

                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: currentTheme.colors.secondary }}
                    title="Secondary"
                    data-oid="0f148jk"
                  />

                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.colors.surface }}
                    title="Surface"
                    data-oid="u:b3.-h"
                  />

                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: currentTheme.colors.background }}
                    title="Background"
                    data-oid="_lllk2q"
                  />
                </div>
              </div>

              <div data-oid="i58z_j3">
                <h4
                  className="font-medium mb-2"
                  style={{ color: currentTheme.colors.text.primary }}
                  data-oid="8mc5d5w"
                >
                  Interactive Elements
                </h4>
                <p
                  className="text-sm"
                  style={{ color: currentTheme.colors.text.secondary }}
                  data-oid="2dcz2-p"
                >
                  Button size:{' '}
                  {ageTier === 'kids'
                    ? 'Large'
                    : ageTier === 'teens_u16'
                      ? 'Medium-Large'
                      : 'Standard'}
                  <br data-oid="uee-cer" />
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
            <Button variant="ghost" onClick={() => setShowModal(false)} data-oid="z8rk-j2">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)} data-oid="egm20q5">
              Confirm
            </Button>
          </>
        }
        data-oid="n8:0uz4"
      >
        <div className="space-y-4" data-oid="a9.gz:j">
          <p style={{ color: currentTheme.colors.text.primary }} data-oid="es41fvg">
            This is a demo modal showcasing the modal component with age-appropriate styling.
          </p>

          <Input label="Sample Input" placeholder="Type something..." data-oid=":kba-x6" />

          <div className="flex gap-2" data-oid="86bvxlq">
            <Badge variant="info" data-oid="y-j0hgq">
              Modal Content
            </Badge>
            <Badge variant="success" data-oid="-4mbb13">
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
          data-oid="kmr5r4v"
        />
      )}
    </div>
  );
}
