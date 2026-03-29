package com.example.threadbench.infrastructure.jmeter;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@Service
public class JMeterTestPlanWriter {

    private static final String TEMPLATE = """
            <?xml version="1.0" encoding="UTF-8"?>
            <jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
              <hashTree>
                <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Thread Benchmark Plan" enabled="true">
                  <stringProp name="TestPlan.comments"></stringProp>
                  <boolProp name="TestPlan.functional_mode">false</boolProp>
                  <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
                  <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
                    <collectionProp name="Arguments.arguments"/>
                  </elementProp>
                </TestPlan>
                <hashTree>
                  <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Benchmark Threads" enabled="true">
                    <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
                    <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
                      <boolProp name="LoopController.continue_forever">false</boolProp>
                      <stringProp name="LoopController.loops">${__P(loopCount,10000)}</stringProp>
                    </elementProp>
                    <stringProp name="ThreadGroup.num_threads">${__P(numThreads,50)}</stringProp>
                    <stringProp name="ThreadGroup.ramp_time">${__P(rampUpSeconds,5)}</stringProp>
                    <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
                    <stringProp name="ThreadGroup.duration">${__P(durationSeconds,60)}</stringProp>
                    <stringProp name="ThreadGroup.delay"></stringProp>
                    <boolProp name="ThreadGroup.scheduler">true</boolProp>
                  </ThreadGroup>
                  <hashTree>
                    <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="Benchmark Headers" enabled="true">
                      <collectionProp name="HeaderManager.headers">
                        <elementProp name="" elementType="Header">
                          <stringProp name="Header.name">X-Benchmark-Run-Id</stringProp>
                          <stringProp name="Header.value">${__P(runId,adhoc)}</stringProp>
                        </elementProp>
                      </collectionProp>
                    </HeaderManager>
                    <hashTree/>
                    <ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Defaults" enabled="true">
                      <stringProp name="HTTPSampler.protocol">${__P(protocol,http)}</stringProp>
                      <stringProp name="HTTPSampler.domain">${__P(host,localhost)}</stringProp>
                      <stringProp name="HTTPSampler.port">${__P(port,8080)}</stringProp>
                    </ConfigTestElement>
                    <hashTree/>
                    <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Benchmark Request" enabled="true">
                      <boolProp name="HTTPSampler.postBodyRaw">false</boolProp>
                      <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
                        <collectionProp name="Arguments.arguments"/>
                      </elementProp>
                      <stringProp name="HTTPSampler.domain"></stringProp>
                      <stringProp name="HTTPSampler.port"></stringProp>
                      <stringProp name="HTTPSampler.protocol"></stringProp>
                      <stringProp name="HTTPSampler.contentEncoding"></stringProp>
                      <stringProp name="HTTPSampler.path">${__P(requestPath,/api/workloads/mixed/1?delayMs=100)}</stringProp>
                      <stringProp name="HTTPSampler.method">GET</stringProp>
                      <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
                      <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
                      <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
                      <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
                      <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
                      <stringProp name="HTTPSampler.connect_timeout"></stringProp>
                      <stringProp name="HTTPSampler.response_timeout"></stringProp>
                    </HTTPSamplerProxy>
                    <hashTree/>
                    <ResultCollector guiclass="SimpleDataWriter" testclass="ResultCollector" testname="Results" enabled="true">
                      <boolProp name="ResultCollector.error_logging">false</boolProp>
                      <objProp>
                        <name>saveConfig</name>
                        <value class="SampleSaveConfiguration">
                          <time>true</time>
                          <latency>false</latency>
                          <timestamp>true</timestamp>
                          <success>true</success>
                          <label>true</label>
                          <code>false</code>
                          <message>false</message>
                          <threadName>false</threadName>
                          <dataType>false</dataType>
                          <encoding>false</encoding>
                          <assertions>false</assertions>
                          <subresults>false</subresults>
                          <responseData>false</responseData>
                          <samplerData>false</samplerData>
                          <xml>false</xml>
                          <fieldNames>true</fieldNames>
                          <responseHeaders>false</responseHeaders>
                          <requestHeaders>false</requestHeaders>
                          <responseDataOnError>false</responseDataOnError>
                          <saveAssertionResultsFailureMessage>false</saveAssertionResultsFailureMessage>
                          <assertionsResultsToSave>0</assertionsResultsToSave>
                          <bytes>false</bytes>
                          <sentBytes>false</sentBytes>
                          <url>false</url>
                          <threadCounts>false</threadCounts>
                          <idleTime>false</idleTime>
                          <connectTime>false</connectTime>
                        </value>
                      </objProp>
                      <stringProp name="filename"></stringProp>
                    </ResultCollector>
                    <hashTree/>
                  </hashTree>
                </hashTree>
              </hashTree>
            </jmeterTestPlan>
            """;

    public Path write(Path targetPath) throws IOException {
        Files.writeString(
                targetPath,
                TEMPLATE,
                StandardCharsets.UTF_8,
                StandardOpenOption.CREATE,
                StandardOpenOption.TRUNCATE_EXISTING
        );
        return targetPath;
    }
}
