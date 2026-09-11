'use client'

import { Badge, Box, Card, Grid, Heading, HStack, Separator, Text, VStack } from "@chakra-ui/react"
import React from "react"
import { useColorMode } from "@vrobots/storybook"
import type { IAiStreamResponse } from "@/hooks/useAiStream"

type ResponseSection = {
  title: string
  body: string[]
}

type ParsedResponse = {
  lead: string[]
  sections: ResponseSection[]
}

const SECTION_HEADING_RE = /^\*\*(.+?)\*\*:?\s*(.*)$/
const PLAIN_SECTION_HEADING_RE = /^(Background|Key considerations?|Recommendation|Recommendations|Assessment|Plan|Diagnosis|Summary|Caveats|Risks|Warnings|Red flags|Follow-up|Monitoring|Treatment):\s*(.*)$/i
const NUMBERED_POINT_RE = /^\d+\.\s+\*\*(.+?)\*\*:\s*(.+)$/
const BULLET_RE = /^\*\s+(.+)$/
const DISCLAIMER_RE = /^\*Disclaimer:/i

function getSectionTone(title: string) {
  const normalized = title.trim().toLowerCase()

  if (normalized.includes("background")) {
    return {
      palette: "cyan",
      border: { _light: "cyan.200", _dark: "cyan.700" },
      accent: { _light: "cyan.500", _dark: "cyan.300" },
      surface: { _light: "rgba(236, 254, 255, 0.82)", _dark: "rgba(8, 47, 73, 0.32)" },
    }
  }

  if (normalized.includes("key") || normalized.includes("consideration")) {
    return {
      palette: "teal",
      border: { _light: "teal.200", _dark: "teal.700" },
      accent: { _light: "teal.500", _dark: "teal.300" },
      surface: { _light: "rgba(240, 253, 250, 0.86)", _dark: "rgba(4, 47, 46, 0.3)" },
    }
  }

  if (normalized.includes("recommend")) {
    return {
      palette: "green",
      border: { _light: "green.200", _dark: "green.700" },
      accent: { _light: "green.500", _dark: "green.300" },
      surface: { _light: "rgba(240, 253, 244, 0.88)", _dark: "rgba(20, 83, 45, 0.26)" },
    }
  }

  if (normalized.includes("caveat") || normalized.includes("risk") || normalized.includes("warning")) {
    return {
      palette: "orange",
      border: { _light: "orange.200", _dark: "orange.700" },
      accent: { _light: "orange.500", _dark: "orange.300" },
      surface: { _light: "rgba(255, 247, 237, 0.9)", _dark: "rgba(124, 45, 18, 0.22)" },
    }
  }

  return {
    palette: "blue",
    border: { _light: "rgba(15,23,42,0.08)", _dark: "whiteAlpha.200" },
    accent: { _light: "blue.500", _dark: "blue.300" },
    surface: { _light: "rgba(248, 250, 252, 0.9)", _dark: "rgba(255,255,255,0.04)" },
  }
}

/** Render a string with **bold** markers as inline bold spans. */
function RichText({ children }: { children: string }) {
  const parts = children.split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text as="span" key={i} fontWeight="bold">
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </>
  )
}

function splitParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = []
  let current: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (current.length) {
        paragraphs.push(current.join(" "))
        current = []
      }
      continue
    }
    current.push(line)
  }

  if (current.length) {
    paragraphs.push(current.join(" "))
  }

  return paragraphs
}

function splitBlocks(lines: string[]): string[][] {
  const blocks: string[][] = []
  let current: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (current.length) {
        blocks.push(current)
        current = []
      }
      continue
    }
    current.push(line)
  }

  if (current.length) {
    blocks.push(current)
  }

  return blocks
}

function parseResponse(text: string): ParsedResponse {
  const lines = text.replace(/\r/g, "").split("\n")
  const leadLines: string[] = []
  const sections: ResponseSection[] = []
  let currentSection: ResponseSection | null = null

  for (const line of lines) {
    const trimmedLine = line.trim()
    const headingMatch = trimmedLine.match(SECTION_HEADING_RE)
    if (headingMatch) {
      currentSection = {
        title: headingMatch[1].trim(),
        body: headingMatch[2] ? [headingMatch[2].trim()] : [],
      }
      sections.push(currentSection)
      continue
    }

    const plainHeadingMatch = trimmedLine.match(PLAIN_SECTION_HEADING_RE)
    if (plainHeadingMatch) {
      currentSection = {
        title: plainHeadingMatch[1].trim(),
        body: plainHeadingMatch[2] ? [plainHeadingMatch[2].trim()] : [],
      }
      sections.push(currentSection)
      continue
    }

    if (currentSection) {
      currentSection.body.push(line)
    } else {
      leadLines.push(line)
    }
  }

  return {
    lead: splitParagraphs(leadLines),
    sections: sections.map((section) => ({
      ...section,
      body: section.body,
    })),
  }
}

const PLAIN_NUMBERED_RE = /^\d+\.\s+(.+)$/

function renderStructuredBlock(title: string, blockLines: string[], tone: ReturnType<typeof getSectionTone>, keyPrefix: string) {
  const numberedItems = blockLines
    .map((line) => line.match(PLAIN_NUMBERED_RE))
    .filter((match): match is RegExpMatchArray => Boolean(match))

  if (numberedItems.length === blockLines.length && numberedItems.length > 0) {
    return (
      <VStack key={keyPrefix} align="stretch" gap={3}>
        {numberedItems.map((item, index) => (
          <HStack
            key={`${title}-mixed-number-${index}`}
            align="start"
            gap={3}
            px={4}
            py={3}
            borderRadius="xl"
            bg={tone.surface}
            borderWidth="1px"
            borderColor={tone.border}
          >
            <Badge minW="2rem" justifyContent="center" colorPalette={tone.palette} variant="subtle" borderRadius="full" px={2} py={1}>
              {index + 1}
            </Badge>
            <Text flex="1" color={{ _light: "gray.700", _dark: "whiteAlpha.850" }} lineHeight="1.8">
              <RichText>{item[1]}</RichText>
            </Text>
          </HStack>
        ))}
      </VStack>
    )
  }

  const bulletItems = blockLines
    .map((line) => line.match(BULLET_RE))
    .filter((match): match is RegExpMatchArray => Boolean(match))

  if (bulletItems.length === blockLines.length && bulletItems.length > 0) {
    return (
      <VStack key={keyPrefix} align="stretch" gap={3}>
        {bulletItems.map((item, index) => (
          <HStack
            key={`${title}-mixed-bullet-${index}`}
            align="start"
            gap={3}
            px={4}
            py={3}
            borderRadius="xl"
            bg={tone.surface}
            borderWidth="1px"
            borderColor={tone.border}
          >
            <Box mt={2} w={2.5} h={2.5} borderRadius="full" bg={tone.accent} flexShrink={0} />
            <Text color={{ _light: "gray.700", _dark: "whiteAlpha.820" }} lineHeight="1.8">
              <RichText>{item[1]}</RichText>
            </Text>
          </HStack>
        ))}
      </VStack>
    )
  }

  const joined = blockLines.join(" ")
  if (DISCLAIMER_RE.test(joined)) {
    return (
      <Box
        key={keyPrefix}
        borderRadius="xl"
        bg={{ _light: "orange.50", _dark: "orange.950" }}
        borderWidth="1px"
        borderColor={{ _light: "orange.200", _dark: "orange.500" }}
        px={4}
        py={3.5}
      >
        <Text fontSize="sm" lineHeight="1.8" color={{ _light: "orange.900", _dark: "orange.100" }}>
          <RichText>{joined}</RichText>
        </Text>
      </Box>
    )
  }

  return (
    <Text
      key={keyPrefix}
      color={{ _light: "gray.700", _dark: "whiteAlpha.850" }}
      lineHeight="1.95"
      fontSize={{ base: "md", md: "lg" }}
      letterSpacing="-0.01em"
    >
      <RichText>{joined}</RichText>
    </Text>
  )
}

function renderSectionBody(title: string, lines: string[]) {
  if (/^ICD-10 codes$/i.test(title) || /^CPT codes$/i.test(title)) return null

  const tone = getSectionTone(title)

  // Expand the raw lines by splitting any inline-concatenated numbered items
  // e.g. "1. Foo bar. 2. Baz qux." → ["1. Foo bar.", "2. Baz qux."]
  // Blank lines are preserved so splitBlocks can still group prose sections.
  const expandedLines = lines.flatMap((rawLine) => {
    const line = rawLine.trim()
    if (!line) return [""] // preserve blank line as block separator
    const parts = line.split(/\s+(?=\d+\.\s)/).map((p) => p.trim()).filter(Boolean)
    return parts.length > 1 ? parts : [line]
  })

  // Collect all non-empty lines across the entire section body.
  const nonEmpty = expandedLines.filter(Boolean)

  // ── Bold-card list: "1. **Title**: description" ────────────────────────────
  const boldItems = nonEmpty
    .map((l) => l.match(NUMBERED_POINT_RE))
    .filter((m): m is RegExpMatchArray => Boolean(m))

  if (boldItems.length === nonEmpty.length && boldItems.length > 0) {
    return (
      <VStack align="stretch" gap={3} maxW="72ch">
        {boldItems.map((item, i) => (
          <Box
            key={`${title}-bold-${i}`}
            borderWidth="1px"
            borderColor={tone.border}
            borderRadius="xl"
            bg={tone.surface}
            pl={5}
            pr={4}
            py={4}
            boxShadow={{ _light: "0 10px 28px rgba(15, 23, 42, 0.06)", _dark: "none" }}
            position="relative"
          >
            <Box position="absolute" left={0} top={0} bottom={0} w="3px" bg={tone.accent} borderLeftRadius="xl" />
            <HStack align="start" gap={3}>
              <Badge minW="2rem" justifyContent="center" colorPalette={tone.palette} variant="surface" borderRadius="full" px={2} py={1}>
                {i + 1}
              </Badge>
              <VStack align="start" gap={1.5} flex="1">
                <Text fontWeight="semibold" fontSize="md" letterSpacing="-0.01em">
                  <RichText>{item[1]}</RichText>
                </Text>
                <Text color={{ _light: "gray.700", _dark: "whiteAlpha.840" }} lineHeight="1.8">
                  <RichText>{item[2]}</RichText>
                </Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    )
  }

  // ── Plain numbered list: "1. Some text…" ───────────────────────────────────
  const plainItems = nonEmpty
    .map((l) => l.match(PLAIN_NUMBERED_RE))
    .filter((m): m is RegExpMatchArray => Boolean(m))

  if (plainItems.length === nonEmpty.length && plainItems.length > 0) {
    return (
      <VStack align="stretch" gap={3} maxW="72ch">
        {plainItems.map((item, i) => (
          <HStack
            key={`${title}-plain-${i}`}
            align="start"
            gap={3}
            px={4}
            py={3}
            borderRadius="xl"
            bg={tone.surface}
            borderWidth="1px"
            borderColor={tone.border}
          >
            <Badge minW="2rem" justifyContent="center" colorPalette={tone.palette} variant="subtle" borderRadius="full" px={2} py={1}>
              {i + 1}
            </Badge>
            <Text flex="1" color={{ _light: "gray.700", _dark: "whiteAlpha.850" }} lineHeight="1.8">
              <RichText>{item[1]}</RichText>
            </Text>
          </HStack>
        ))}
      </VStack>
    )
  }

  // ── Bullet list: "* Some text" ──────────────────────────────────────────────
  const bulletItems = nonEmpty
    .map((l) => l.match(BULLET_RE))
    .filter((m): m is RegExpMatchArray => Boolean(m))

  if (bulletItems.length === nonEmpty.length && bulletItems.length > 0) {
    return (
      <VStack align="stretch" gap={3} maxW="72ch">
        {bulletItems.map((item, i) => (
          <HStack
            key={`${title}-bullet-${i}`}
            align="start"
            gap={3}
            px={4}
            py={3}
            borderRadius="xl"
            bg={tone.surface}
            borderWidth="1px"
            borderColor={tone.border}
          >
            <Box mt={2} w={2.5} h={2.5} borderRadius="full" bg={tone.accent} flexShrink={0} />
            <Text color={{ _light: "gray.700", _dark: "whiteAlpha.820" }} lineHeight="1.8">
              <RichText>{item[1]}</RichText>
            </Text>
          </HStack>
        ))}
      </VStack>
    )
  }

  // ── Mixed / prose — fall back to block-by-block rendering ──────────────────
  const blocks = splitBlocks(expandedLines)
  return (
    <VStack align="stretch" gap={4} maxW="72ch">
      {blocks.map((block, index) => renderStructuredBlock(title, block.filter(Boolean), tone, `${title}-prose-${index}`))}
    </VStack>
  )
}

function CodeTable({
  title,
  items,
}: {
  title: string
  items: Array<{ code: string; description: string; confidence: number; rationale: string }>
}) {
  if (!items.length) {
    return null
  }

  return (
    <Card.Root bg={{ _light: "rgba(255,255,255,0.72)", _dark: "rgba(31,39,50,0.72)" }} borderWidth="1px" borderColor={{ _light: "rgba(15,23,42,0.08)", _dark: "whiteAlpha.200" }}>
      <Card.Header>
        <HStack justify="space-between" align="center">
          <Heading size="md">{title}</Heading>
          <Badge colorPalette="teal" variant="subtle">{items.length}</Badge>
        </HStack>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap={3}>
          {items.map((item) => (
            <Box
              key={`${title}-${item.code}`}
              borderWidth="1px"
              borderColor={{ _light: "rgba(15,23,42,0.08)", _dark: "whiteAlpha.200" }}
              borderRadius="xl"
              bg={{ _light: "rgba(248,250,252,0.96)", _dark: "rgba(255,255,255,0.04)" }}
              px={4}
              py={3}
            >
              <HStack justify="space-between" align="start" mb={2}>
                <VStack align="start" gap={1}>
                  <Badge colorPalette="blue" variant="surface">{item.code}</Badge>
                  <Text fontWeight="medium"><RichText>{item.description}</RichText></Text>
                </VStack>
                <Text fontSize="sm" color={{ _light: "gray.500", _dark: "whiteAlpha.700" }}>
                  {Math.round(item.confidence * 100)}%
                </Text>
              </HStack>
              <Text fontSize="sm" color={{ _light: "gray.600", _dark: "whiteAlpha.700" }}><RichText>{item.rationale}</RichText></Text>
            </Box>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default function AiResponse({
  prompt,
  response,
  fullResponse,
  isStreaming,
}: {
  prompt: string
  response: string
  fullResponse: IAiStreamResponse | null
  isStreaming: boolean
}) {
  const [displayPrompt, setDisplayPrompt] = React.useState<string>('')
  const { colorMode } = useColorMode()
  const isLightMode = colorMode === "light"

  // Call hooks at the top before any early returns (React Rules of Hooks)
  const parsed = React.useMemo(() => parseResponse(response), [response])
  const isEmergency = response.trimStart().includes("⚠️ **EMERGENCY**:")
  const sections = React.useMemo(
    () => parsed.sections.filter((section) => !/^ICD-10 codes$/i.test(section.title) && !/^CPT codes$/i.test(section.title)),
    [parsed.sections],
  )

  React.useEffect(() => {
    if (prompt !== displayPrompt && !!prompt) {
      setDisplayPrompt(prompt)
    }
  }, [prompt, displayPrompt])

  // Early return for empty state
  if (!response && !isStreaming) {
    return (
      <Card.Root bg={{ _light: "rgba(255,255,255,0.68)", _dark: "rgba(31,39,50,0.72)" }} borderWidth="1px" borderColor={{ _light: "rgba(15,23,42,0.08)", _dark: "whiteAlpha.200" }}>
        <Card.Body>
          <VStack align="start" gap={3}>
            <Badge colorPalette="teal" variant="surface">AI</Badge>
            <Heading size="lg">Ask me anything.</Heading>
            <Text color={{ _light: "gray.600", _dark: "whiteAlpha.700" }} maxW="48rem">
              Answers will render here.
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    )
  }

  return (
    <VStack align="stretch" gap={6}>
      <Card.Root
        bg={isEmergency
          ? isLightMode
            ? "linear-gradient(135deg, rgba(255,241,241,0.98), rgba(254,226,226,0.96) 40%, rgba(252,165,165,0.28))"
            : "linear-gradient(135deg, rgba(127,29,29,0.72), rgba(69,10,10,0.88) 45%, rgba(30,5,5,0.96))"
          : isLightMode
            ? "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(236,253,250,0.94) 45%, rgba(224,231,255,0.86))"
            : "linear-gradient(135deg, rgba(8,28,21,0.95), rgba(20,20,35,0.92))"}
        borderWidth="1px"
        borderColor={isEmergency
          ? { _light: "red.300", _dark: "red.700" }
          : { _light: "rgba(15,23,42,0.08)", _dark: "whiteAlpha.200" }}
        overflow="hidden"
        borderRadius="2xl"
        boxShadow={isEmergency
          ? isLightMode
            ? "0 18px 48px rgba(220, 38, 38, 0.18), 0 0 0 1px rgba(220,38,38,0.12) inset"
            : "0 18px 48px rgba(220, 38, 38, 0.28), 0 0 0 1px rgba(248,113,113,0.12) inset"
          : isLightMode
            ? "0 18px 48px rgba(15, 23, 42, 0.08)"
            : "0 18px 48px rgba(0, 0, 0, 0.32)"}
      >
        <Card.Body px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
          <VStack align="stretch" gap={6}>
            <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
              <VStack align="start" gap={2}>
                {
                  isEmergency ? (
                    <Badge colorPalette="red" variant="solid" px={3} py={1} fontSize="sm" fontWeight="bold" letterSpacing="0.04em">
                      ⚠️ EMERGENCY
                    </Badge>
                  ) : !isStreaming ? (
                    <Badge colorPalette="teal" variant="surface">Response</Badge>
                  ) : (
                    <Badge variant="subtle" colorPalette="red" animation="pulse 2s infinite">
                      Streaming...
                    </Badge>
                  )
                }
                <Heading color={{_light: 'blue.500', _dark: 'blue.300'}} mb={4} mt={4}>
                  {displayPrompt}
                </Heading>
                <Heading
                  size="xl"
                  letterSpacing="-0.03em"
                  color={isEmergency ? { _light: "red.700", _dark: "red.300" } : undefined}
                >
                  {isEmergency ? "Emergency Alert" : "Response Overview"}
                </Heading>
              </VStack>
              {fullResponse ? (
                <HStack gap={2} flexWrap="wrap">
                  {/* <Badge variant="subtle" colorPalette={'cyan'}>{fullResponse.model}</Badge> */}
                  <Badge variant="subtle" colorPalette={'cyan'}>{fullResponse.device.toUpperCase()}</Badge>
                  <Badge variant="subtle" colorPalette={'cyan'}>{fullResponse.elapsed_ms} ms</Badge>
                </HStack>
              ) : null}
            </HStack>

            {parsed.lead.length ? (
              <VStack align="stretch" gap={3} maxW="76ch">
                {parsed.lead.map((paragraph, index) => (
                  <Text
                    key={`lead-${index}`}
                    fontSize={{ base: "lg", md: "xl" }}
                    lineHeight="1.95"
                    letterSpacing="-0.015em"
                    color={{ _light: "gray.700", _dark: "whiteAlpha.900" }}
                  >
                    <RichText>{paragraph}</RichText>
                  </Text>
                ))}
              </VStack>
            ) : null}
          </VStack>
        </Card.Body>
      </Card.Root>

      {sections.map((section) => {
        const tone = getSectionTone(section.title)

        return (
          <Card.Root
            key={section.title}
            bg={{ _light: "rgba(255,255,255,0.72)", _dark: "rgba(31,39,50,0.72)" }}
            borderWidth="1px"
            borderColor={tone.border}
            borderRadius="2xl"
            boxShadow={{ _light: "0 14px 36px rgba(15, 23, 42, 0.06)", _dark: "none" }}
            overflow="hidden"
          >
            <Card.Body px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>
              <Grid templateColumns={{ base: "1fr", lg: "220px minmax(0, 1fr)" }} gap={{ base: 5, lg: 8 }}>
                <VStack align="start" gap={3}>
                  <Badge colorPalette={tone.palette} variant="surface">Section</Badge>
                  <Heading size="lg" letterSpacing="-0.02em">{section.title}</Heading>
                  <Separator borderColor={tone.border} />
                </VStack>
                <Box>{renderSectionBody(section.title, section.body)}</Box>
              </Grid>
            </Card.Body>
          </Card.Root>
        )
      })}
    </VStack>
  )
}